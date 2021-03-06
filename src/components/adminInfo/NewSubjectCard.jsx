import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import addNewImage from '../../images/addNew.png'
import CreateSubjectDialog from './CreateSubjectDialog'
import { useRouteMatch } from 'react-router-dom'
import { baseURL } from '../../general/constants'
import { fetch } from 'whatwg-fetch'
import find from 'lodash.find'
import LoadingDialog from '../quiz/LoadingDialog'

const cardStyle = makeStyles(theme => ({
  card: {
    width: '100%',
    minWidth: '300px',
    height: '300px',
    border: '3px',
    borderStyle: 'dashed',
    '&:hover': {
      borderColor: 'darkred'
    }
  },
  media: {
    backgroundColor: 'white',
    height: '100%',
    width: 'auto',
    overflow: 'hidden',
    position: 'relative',
    transition: '300ms',
    cursor: 'pointer',
    '&:hover': {
      filter: 'brightness(115%)'
    }
  },
  mediaCaption: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'black',
    color: 'white',
    opacity: 0.8,
    width: '100%',
    height: '10%',
    fontSize: '20px',
    fontWeight: 200
  },
  content: {
    maxWidth: '450px'
  },
  input: {
    minWidth: '200px'
  }
}))

const subjectsURL = baseURL + 'subject/'
const imagesURL = baseURL + 'image/'
const questionsURL = baseURL + 'questions/'

const NewSubjectCard = ({ addSubject, addImage, getSubjects }) => {
  const classes = cardStyle()
  const [error, setError] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const controller = new window.AbortController()
  const signal = controller.signal
  const match = useRouteMatch()
  const branch = match.params.weapon
  const category = match.params.category
  const onClose = () => setCreateDialogOpen(false)
  const [imageUploadCounter, setImageUploadCounter] = useState(0)
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(true)

  const postQuestions = (subjectURI, questions) => {
    fetch(questionsURL + subjectURI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(questions)
    })
  }

  const postImages = (subjectURI, imageArray) => {
    setImageUploadCounter(imageArray.length)
    imageArray.forEach(async image => {
      console.log(image)
      const formData = new window.FormData()
      formData.append('file', image.file)
      formData.append('label', image.label)
      formData.append('isDefault', image.default)

      try {
        const response = await fetch(
          imagesURL + branch + '/' + category.toLowerCase() + '/' + subjectURI,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json'
            },
            body: formData
          }
        )
        const data = await response.json()
        console.log(data)
        setImageUploadCounter(imageUploadCounter => imageUploadCounter - 1)
      } catch (error) {
        console.error(error)
        setImageUploadCounter(imageUploadCounter => imageUploadCounter - 1)
        setImageUploadError(true)
      }
    })
    setUploadComplete(false)
  }
  const onCreate = (name, uri, general, units, images, questions) => {
    console.log('creating subject')
    fetch(subjectsURL + branch + '/' + category, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: name.length > 0 ? name : null,
        uri: uri.length > 0 ? uri : null,
        general: general.length > 0 ? general : null,
        units: units.length > 0 ? units : null
      }),
      signal: signal
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else throw Error(`Request rejected with status ${response.status}`)
      })
      .then(data => {
        const { status, result, message } = data
        if (status === 'error') console.log(message)
        if (status === 'success') {
          postImages(result.uri, images)
          postQuestions(result.uri, questions)
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          console.error(error)
        }
      })
    setCreateDialogOpen(false)
  }
  console.log('Outside:' + imageUploadCounter)

  if (uploadComplete === false && imageUploadCounter === 0) {
    getSubjects()
    setUploadComplete(true)
  }

  return (
    <>
      {imageUploadCounter > 0 ? (
        <LoadingDialog
          open={imageUploadCounter > 0}
          reason={`Απομένουν ${imageUploadCounter} φωτογραφίες`}
        />
      ) : null}
      <CreateSubjectDialog
        dialogOpen={createDialogOpen}
        onCreate={onCreate}
        onClose={onClose}
      />
      <Card elevation={8} raised className={classes.card}>
        <CardMedia
          className={classes.media}
          image={addNewImage}
          title='Νέο Θέμα'
          onClick={() => {
            setCreateDialogOpen(true)
          }}
        >
          <Typography className={classes.mediaCaption} align='center'>
            Προσθήκη θέματος
          </Typography>
        </CardMedia>
      </Card>
    </>
  )
}

export default NewSubjectCard
