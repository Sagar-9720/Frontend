import 'package:flutter/material.dart';

class AuthForm extends StatelessWidget {
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final VoidCallback onSubmit;
  final bool isLoading;
  final String? errorMessage;

  const AuthForm({
    required this.emailController,
    required this.passwordController,
    required this.onSubmit,
    required this.isLoading,
    this.errorMessage,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: emailController,
          decoration: InputDecoration(labelText: 'Email'),
        ),
        SizedBox(height: 16),
        TextField(
          controller: passwordController,
          decoration: InputDecoration(labelText: 'Password'),
          obscureText: true,
        ),
        SizedBox(height: 24),
        if (errorMessage != null)
          Text(errorMessage!, style: TextStyle(color: Colors.red)),
        SizedBox(height: 8),
        isLoading
            ? CircularProgressIndicator()
            : ElevatedButton(
                onPressed: onSubmit,
                child: Text('Login'),
              ),
      ],
    );
  }
}
