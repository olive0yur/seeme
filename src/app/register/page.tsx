'use client';

import { useState } from 'react';
import './register.css';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    companyName: ''
  });

  // 邮箱验证正则
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email cannot be empty';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateName = (name: string) => {
    if (!name) {
      return 'Name cannot be empty';
    }
    if (name.length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

  const validateCompanyName = (code: string) => {
    if (!code) {
      return 'Company name cannot be empty';
    }
    if (code.length < 6) {
      return 'Company name must be at least 6 characters';
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 实时验证
    let error = '';
    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'name':
        error = validateName(value);
        break;
      case 'invitationCode':
        error = validateCompanyName(value);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证所有字段
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const companyNameError = validateCompanyName(formData.companyName);
    
    setErrors({
      name: nameError,
      email: emailError,
      companyName: companyNameError
    });

    // 如果没有错误，提交表单
    if (!nameError && !emailError && !companyNameError) {
      console.log('表单提交:', formData);
      // 这里可以调用API提交数据
      alert('验证通过！');
    }
  };

  return (
    <div className="login h-screen bg-[url('https://static.onew.design/see-origin.png')]">
      <div className="loginForm-container">
        <div className='loginForm'>
          <div className='login-title'>Get started Now</div>
          <form className='login-form' onSubmit={handleSubmit}>
            <div className='input-item'>
              <span>Name</span>
              <input 
                type="text" 
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className='input-item'>
              <span>Email</span>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className='input-item'>
              <span>Company name</span>
              <input 
                type="text" 
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={errors.companyName ? 'error' : ''}
              />
              {errors.companyName && <div className="error-message">{errors.companyName}</div>}
            </div>

            <button type="submit" className="submit-btn">
              Log In
            </button>
          </form>
          <div className='login-footer'>
            <span>No invitation code yet？</span>
            <span onClick={goToLogin} className='register-link'>Log In</span>
          </div>
        </div>
      </div>
    </div>
  );
}