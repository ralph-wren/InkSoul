/**
 * 登录界面
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
import { loginUser, clearError } from '../../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { colors, typography, spacing, layout } from '../../theme';
import { LoginRequest } from '../../types/auth';

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<LoginRequest>({
    emailOrUsername: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<LoginRequest>>({});

  useEffect(() => {
    // 清除之前的错误
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('登录失败', error);
    }
  }, [error]);

  const validateForm = (): boolean => {
    const errors: Partial<LoginRequest> = {};

    if (!formData.emailOrUsername.trim()) {
      errors.emailOrUsername = '请输入邮箱或用户名';
    }

    if (!formData.password) {
      errors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      errors.password = '密码长度至少6位';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      // 登录成功后导航会由App.tsx中的认证状态变化自动处理
    } catch (error) {
      // 错误已经在Redux中处理
    }
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register' as never);
  };

  const navigateToForgotPassword = () => {
    // TODO: 实现忘记密码功能
    Alert.alert('提示', '忘记密码功能即将上线');
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
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>登录您的笔心账户</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="邮箱或用户名"
            placeholder="请输入邮箱或用户名"
            value={formData.emailOrUsername}
            onChangeText={(value) => handleInputChange('emailOrUsername', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="person-outline"
            error={formErrors.emailOrUsername}
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

          <Button
            title="登录"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Button
            title="忘记密码？"
            onPress={navigateToForgotPassword}
            variant="text"
            style={styles.forgotButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>还没有账户？</Text>
          <Button
            title="立即注册"
            onPress={navigateToRegister}
            variant="text"
            style={styles.registerButton}
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
  
  loginButton: {
    marginTop: spacing.md,
  },
  
  forgotButton: {
    marginTop: spacing.sm,
    alignSelf: 'center',
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
  
  registerButton: {
    marginLeft: spacing.xs,
  },
});