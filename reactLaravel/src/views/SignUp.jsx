import { useState } from 'react'
import { BeakerIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import axiosClient from '../axios';
import { useStateContext } from '../context/ContextProvider';
function SignUp() {

  const [fullName,setFullName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [passwordConfirmation,setPasswordConfirmation] = useState('');
  const [error,setError] = useState({__html:''});
          const {setCurrentUser,setUserToken} = useStateContext()
   const Onsubmit = (ev)=>{
     ev.preventDefault();
     setError({__html:''})
     axiosClient.post('/signup',{
      name:fullName,
      email:email,
      password:password,
      password_confirmation:passwordConfirmation
     }).then(({data})=>{
         setCurrentUser(data.user)
         setUserToken(data.token)
      console.log(data);
     })
     .catch((error)=>{
        if(error.response){
          const finalErrors = Object.values(error.response.data.errors).reduce((accum,next)=>[...accum,...next],[])
          console.log("compressed errors: ",finalErrors);
          setError({__html:finalErrors.join('<br>')})
        }
        console.log("this is obj of errors: ",error);
    })
   }
  return (
   <>
      <div className="flex h-[80vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up free
          </h2>
        </div>

        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
          {error.__html && (<div className="bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={error}>
      </div>)}
          <form className="space-y-6" action="#" method="POST" onSubmit={Onsubmit}>
            <div>
            <label htmlFor="Name" className="block text-sm font-medium leading-6 text-gray-900">
               Full Name
              </label>
              <div className="mt-2 mb-2">
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e)=>setFullName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password Confirmation
                </label>
              </div>
                <input
                  id='password-confirmation'
                  name='password_confirmation'
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passwordConfirmation}
                  onChange={(e)=>setPasswordConfirmation
                    (e.target.value)}
                  placeholder='password confirmation'
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="text-sm mt-3">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already member?{' '}
            <Link to='/login' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Signin now</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default SignUp
