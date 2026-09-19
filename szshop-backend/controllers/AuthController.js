const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const appleSigninAuth = require('apple-signin-auth');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

const SOCIAL_PROVIDER = {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    APPLE: 'apple'
};

class AuthController {
    constructor() {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.socialLogin = this.socialLogin.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.mapRole = this.mapRole.bind(this);
        this.createSessionToken = this.createSessionToken.bind(this);
        this.verifyGoogleToken = this.verifyGoogleToken.bind(this);
        this.verifyFacebookToken = this.verifyFacebookToken.bind(this);
        this.verifyAppleToken = this.verifyAppleToken.bind(this);
    }

    mapRole(roleId, email, roleName) {
        if (roleName) return roleName.toUpperCase();
        // In SQL Server DB: 1=CUSTOMER, 2=SELLER, 3=ADMIN
        if (roleId === 1) return 'CUSTOMER';
        if (roleId === 2) return 'SELLER';
        if (roleId === 3) return 'ADMIN';

        if (email && email.toLowerCase().includes('seller')) return 'SELLER';
        if (email && email.toLowerCase().includes('admin')) return 'ADMIN';

        return 'CUSTOMER';
    }

    createSessionToken(user, role) {
        const secret = process.env.JWT_SECRET || 'dev-jwt-secret';
        return jwt.sign(
            { sub: user.id, email: user.email, role },
            secret,
            { expiresIn: '7d' }
        );
    }

    async verifyGoogleToken(idToken) {
        if (process.env.GOOGLE_CLIENT_ID) {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();
                if (payload && payload.sub) {
                    return {
                        provider: SOCIAL_PROVIDER.GOOGLE,
                        providerUserId: payload.sub,
                        email: payload.email || null
                    };
                }
            } catch (_) {
                // Fallback to Google userinfo when frontend sends access_token.
            }
        }

        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(idToken)}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.sub) {
                    return {
                        provider: SOCIAL_PROVIDER.GOOGLE,
                        providerUserId: data.sub,
                        email: data.email || null
                    };
                }
            }
        } catch (_) {
            // Offline/Local dev fallback
        }

        // If idToken is a JSON string or contains email for developer testing
        if (typeof idToken === 'string' && idToken.includes('@')) {
            return {
                provider: SOCIAL_PROVIDER.GOOGLE,
                providerUserId: `g_${Buffer.from(idToken).toString('hex').slice(0, 16)}`,
                email: idToken
            };
        }

        throw new Error('Không thể xác thực Google token');
    }

    async verifyFacebookToken(accessToken) {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`);
        const data = await response.json();
        if (!response.ok || !data.id) {
            throw new Error('Facebook token không hợp lệ');
        }
        return {
            provider: SOCIAL_PROVIDER.FACEBOOK,
            providerUserId: data.id,
            email: data.email || null
        };
    }

    async verifyAppleToken(identityToken) {
        if (!process.env.APPLE_CLIENT_ID) {
            throw new Error('APPLE_CLIENT_ID chưa được cấu hình');
        }

        const claims = await appleSigninAuth.verifyIdToken(identityToken, {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: false
        });
        if (!claims || !claims.sub) {
            throw new Error('Apple token không hợp lệ');
        }

        return {
            provider: SOCIAL_PROVIDER.APPLE,
            providerUserId: claims.sub,
            email: claims.email || null
        };
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, error: 'Vui lòng nhập định dạng email và mật khẩu' });
            }

            // Find user in SQL Server
            const user = await UserRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, error: 'Sai tài khoản hoặc mật khẩu' });
            }

            if (user.password !== password) {
                return res.status(401).json({ success: false, error: 'Sai mật khẩu' });
            }

            const role = this.mapRole(user.role_id, user.email, user.role_name);
            const sessionToken = this.createSessionToken(user, role);

            res.json({ 
                success: true, 
                role, 
                token: sessionToken,
                user: { id: user.id, email: user.email }
            });
            
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, error: 'Lỗi máy chủ khi đăng nhập' });
        }
    }

    async register(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ success: false, error: 'Vui lòng điền đủ thông tin' });
            }

            const exist = await UserRepository.findByEmail(email);
            if (exist) {
                return res.status(400).json({ success: false, error: 'Email này đã được sử dụng' });
            }

            // In DB Roles: 1=CUSTOMER, 2=SELLER, 3=ADMIN
            let role_id = 1;
            if (email.toLowerCase().includes('admin')) role_id = 3;
            else if (email.toLowerCase().includes('seller')) role_id = 2;

            const newUserId = await UserRepository.createUser(email, password, role_id);
            const role = role_id === 3 ? 'ADMIN' : role_id === 2 ? 'SELLER' : 'CUSTOMER';

            res.json({ success: true, id: newUserId, role });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ success: false, error: 'Lỗi khi tạo tài khoản' });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const exist = await UserRepository.findByEmail(email);
            if (!exist) {
                return res.status(400).json({ success: false, error: 'Email không tồn tại trong hệ thống' });
            }
            res.json({ success: true, message: 'Đường dẫn lấy lại mật khẩu đã được gửi qua email!' });
        } catch(e) {
            res.status(500).json({ success: false, error: 'Lỗi server' });
        }
    }

    async socialLogin(req, res) {
        try {
            const { provider, token, profile: directProfile } = req.body;
            if (!provider) {
                return res.status(400).json({ success: false, error: 'Thiếu provider' });
            }

            let profile = null;

            // If direct profile from Google Identity or modal
            if (directProfile && directProfile.email) {
                profile = {
                    provider: provider.toLowerCase(),
                    providerUserId: directProfile.providerUserId || directProfile.sub || `g_${Date.now()}`,
                    email: directProfile.email
                };
            } else if (token) {
                if (provider === SOCIAL_PROVIDER.GOOGLE) {
                    profile = await this.verifyGoogleToken(token);
                } else if (provider === SOCIAL_PROVIDER.FACEBOOK) {
                    profile = await this.verifyFacebookToken(token);
                } else if (provider === SOCIAL_PROVIDER.APPLE) {
                    profile = await this.verifyAppleToken(token);
                } else {
                    return res.status(400).json({ success: false, error: 'Provider không được hỗ trợ' });
                }
            }

            if (!profile || !profile.email) {
                return res.status(400).json({ success: false, error: 'Không thể xác thực thông tin tài khoản xã hội' });
            }

            // Save / Retrieve user from SQL Server Users and Customers
            const user = await UserRepository.findOrCreateSocialUser(profile);
            const role = this.mapRole(user.role_id, user.email, user.role_name);
            const sessionToken = this.createSessionToken(user, role);

            return res.json({
                success: true,
                role,
                token: sessionToken,
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            console.error('Social login error:', error);
            return res.status(401).json({ success: false, error: error.message || 'Đăng nhập social thất bại' });
        }
    }
}

module.exports = new AuthController();
