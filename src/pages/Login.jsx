function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100"> 
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">                            
            <h2 className="text-2xl font-bold mb-6 text-center">Login to Tanaw</h2>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
                    <input className="w-full px-3 py-2 border rounded" type="text" id="username" name="username" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <input className="w-full px-3 py-2 border rounded" type="password" id="password" name="password" />
                </div>
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition" type="submit">Login</button>
            </form>
        </div>
    </div>
  );
}   

export default Login