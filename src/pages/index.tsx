import { Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import DashboardIndexPage from './dashboard'
import AboutPage from './dashboard/about'
import NetworkPage from './dashboard/network'
import ConfigPage from './dashboard/config'
import LogsPage from './dashboard/logs'

import useAuth from '@/hooks/auth'
import DefaultLayout from '@/layouts/default'
import { useLocalStorage } from '@uidotdev/usehooks'
import key from '@/const/key'
import QQManager from '@/controllers/qq_manager'

export default function IndexPage() {
  const { isAuth } = useAuth()
  const [storeURL] = useLocalStorage(key.storeURL)
  const navigate = useNavigate()

  const isStoreURLInvalid =
    !!storeURL && storeURL !== 'http://' && storeURL !== 'https://'

  const checkIsQQLogin = async () => {
    try {
      const result = await QQManager.checkQQLoginStatus()
      if (!result.isLogin) {
        if (isAuth) {
          navigate('/qq_login', { replace: true })
        } else {
          navigate('/web_login', { replace: true })
        }
      }
    } catch (error) {
      navigate('/web_login', { replace: true })
    }
  }

  useEffect(() => {
    if (!isAuth || !isStoreURLInvalid) {
      const search = new URLSearchParams(window.location.search)
      const token = search.get('token')
      let url = '/web_login'

      if (token && isStoreURLInvalid) {
        url += `?token=${token}`
      }
      navigate(url, { replace: true })
    } else {
      checkIsQQLogin()
    }
  }, [isAuth, storeURL, navigate])

  return (
    <DefaultLayout>
      <Routes>
        <Route element={<DashboardIndexPage />} path="/" />
        <Route element={<NetworkPage />} path="/network" />
        <Route element={<ConfigPage />} path="/config" />
        <Route element={<LogsPage />} path="/logs" />
        <Route element={<AboutPage />} path="/about" />
      </Routes>
    </DefaultLayout>
  )
}
