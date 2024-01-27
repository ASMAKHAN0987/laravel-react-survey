import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './views/Dashboard.jsx'
import Login from './views/Login.jsx'
import SignUp from './views/SignUp.jsx'
import Surveys from './views/Surveys.jsx'
import GuestLayout from './components/GuestLayout.jsx'
import NotFound from './views/NotFound.jsx'
import DefaultLayout from './components/DefaultLayout.jsx'
import SurveyViews from './views/SurveyViews.jsx'
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path='/' element={<GuestLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
            </Route>
            <Route path='/' element={<DefaultLayout/>}>
            <Route path='' element={<Navigate to="/dashboard"/>}/>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/surveys' element={<Surveys />} />
            <Route path='/surveys/create' element={<SurveyViews />} />
            </Route>
            <Route path='*' element={<NotFound />} />
        </Route>
    )
)
export default router