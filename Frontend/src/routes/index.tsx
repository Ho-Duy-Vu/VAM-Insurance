import { createBrowserRouter } from 'react-router-dom'
import { UploadPage } from '../pages/UploadPage'
import { DocumentReviewLayout } from '../pages/DocumentReviewLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <UploadPage />,
  },
  {
    path: '/document/:id',
    element: <DocumentReviewLayout />,
  },
])