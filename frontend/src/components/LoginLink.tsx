const API_URL = import.meta.env.VITE_API_URL;

const LoginLink = () => {
  return (
    <a className="text-green-400" href={`${API_URL}/login/federated/google`}>Click Here to Login</a>
  )
}

export default LoginLink