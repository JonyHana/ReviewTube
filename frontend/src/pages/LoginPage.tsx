const LoginPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  return (
    <>
      <a href={`${API_URL}/login/federated/google`}>Click to Login</a>
    </>
  )
}

export default LoginPage