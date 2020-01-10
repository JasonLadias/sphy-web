import React, { useState, useEffect } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import './App.css'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import LoginContainer from './components/containers/loginContainer'
import HomeContainer from './components/containers/homeContainer'
import InfoContainer, {
  WeaponContainer,
  CategoryContainer,
  SubjectContainer
} from './components/containers/infoContainer'
import {
  QuestionContainer,
  QuizContainer
} from './components/containers/quizContainer'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useSelector } from 'react-redux'

const themeObject = {
  palette: {
    primary: {
      main: '#003300'
    },
    secondary: {
      main: '#cc6600'
    }
  },
  typography: {
    useNextVariants: true
  }
}

const useDarkMode = () => {
  const [theme, setTheme] = useState(themeObject)
  const toogleDarkMode = dark => {
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: dark ? 'dark' : 'light'
      }
    }
    setTheme(updatedTheme)
  }
  return [theme, toogleDarkMode]
}

function App () {
  const [theme, toogleDarkMode] = useDarkMode()
  const dark = useSelector(state => state.dark)
  useEffect(() => {
    toogleDarkMode(dark)
  }, [dark])
  const themeConfig = createMuiTheme(theme)
  return (
    <Router>
      <MuiThemeProvider theme={themeConfig}>
        <CssBaseline />
        <Switch>
          <Route exact path='/login' component={LoginContainer} />
          <Route exact path='/' component={HomeContainer} />
          <Route exact path='/info' component={InfoContainer} />
          <Route exact path='/info/:weapon' component={WeaponContainer} />
          <Route
            exact
            path='/info/:weapon/:category'
            component={CategoryContainer}
          />
          <Route
            exact
            path='/info/:weapon/:category/:subject'
            component={SubjectContainer}
          />
          <Route exact path='/quiz' component={QuizContainer} />
          <Route
            exact
            path='/question/:questionIndex'
            component={QuestionContainer}
          />
        </Switch>
      </MuiThemeProvider>
    </Router>
  )
}

export default App
