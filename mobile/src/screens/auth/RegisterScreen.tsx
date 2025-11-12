/**
 * 注册界面
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { AuthService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { colors, typography, spacing, layout } from '../../theme';
import { SignUpRequest } from '../../types/auth';

export const RegisterScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<SignUpRequest>({
    email: '',
    username: '',
    password: '',
    displayName: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<SignUpRequest>>({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    // 清除之前的错误
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('注册失败', error);
    }
  }, [error]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = async (): Promise<boolean> => {
    const errors: Partial<SignUpRequest> = {};

    // 邮箱验证
    if (!formData.email.trim()) {
      errors.email = '请输入邮箱';
    } else if (!validateEmail(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    } else {
      try {
        const isAvailable = await AuthService.checkEmailAvailability(formData.email);
        if (!isAvailable) {
          errors.email = '该邮箱已被注册';
        }
      } catch (error) {
        console.error('检查邮箱可用性失败:', error);
      }
    }

    // 用户名验证
    if (!formData.username.trim()) {
      errors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      errors.username = '用户名长度至少3位';
    } else if (formData.username.length > 50) {
      errors.username = '用户名长度不能超过50位';
    } else {
      try {
        const isAvailable = await AuthService.checkUsernameAvailability(formData.username);
        if (!isAvailable) {
          errors.username = '该用户名已被使用';
        }
      } catch (error) {
        console.error('检查用户名可用性失败:', error);
      }
    }

    // 密码验证
    if (!formData.password) {
      errors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      errors.password = '密码长度至少6位';
    } else if (formData.password.length > 100) {
      errors.password = '密码长度不能超过100位';
    }

    // 确认密码验证
    let confirmError = '';
    if (!confirmPassword) {
      confirmError = '请确认密码';
    } else if (confirmPassword !== formData.password) {
      confirmError = '两次输入的密码不一致';
    }

    // 显示名称验证（可选）
    if (formData.displayName && formData.displayName.length > 100) {
      errors.displayName = '显示名称长度不能超过100位';
    }

    setFormErrors(errors);
    setConfirmPasswordError(confirmError);
    
    return Object.keys(errors).length === 0 && !confirmError;
  };

  const handleRegister = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      Alert.alert(
        '注册成功',
        '账户创建成功！请验证邮箱后登录。',
        [
          {
            text: '去登录',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (error) {
      // 错误已经在Redux中处理
    }
  };

  const handleInputChange = (field: keyof SignUpRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>创建账户</Text>
          <Text style={styles.subtitle}>加入笔心，开始您的智能日记之旅</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="邮箱"
            placeholder="请输入邮箱地址"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={formErrors.email}
          />

          <Input
            label="用户名"
            placeholder="请输入用户名"
            value={formData.username}
            onChangeText={(value) => handleInputChange('username', value)}
            autoCapitalize="none"
            leftIcon="person-outline"
            error={formErrors.username}
          />

          <Input
            label="显示名称（可选）"
            placeholder="请输入显示名称"
            value={formData.displayName}
            onChangeText={(value) => handleInputChange('displayName', value)}
            leftIcon="person-circle-outline"
            error={formErrors.displayName}
          />

          <Input
            label="密码"
            placeholder="请输入密码"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={formErrors.password}
          />

          <Input
            label="确认密码"
            placeholder="请再次输入密码"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={confirmPasswordError}
          />

          <Button
            title="注册"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>已有账户？</Text>
          <Button
            title="立即登录"
            onPress={navigateToLogin}
            variant="text"
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  scrollContent: {
    flexGrow: 1,
    padding: layout.screenPadding,
    justifyContent: 'center',
  },
  
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  
  title: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  
  subtitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  form: {
    marginBottom: spacing.xl,
  },
  
  registerButton: {
    marginTop: spacing.md,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  
  footerText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  
  loginButton: {
    marginLeft: spacing.xs,
  },
});