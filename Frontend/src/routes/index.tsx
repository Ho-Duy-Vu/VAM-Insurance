import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

// Import pages từ các folders đã tổ chức
import HomePage from '../pages/general/HomePage'
import AboutPage from '../pages/general/AboutPage'
import ContactPage from '../pages/general/ContactPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ProductsPage from '../pages/insurance/ProductsPage'
import { PackageDetailPage } from '../pages/insurance/PackageDetailPage'
import NaturalDisasterPackageDetailPage from '../pages/insurance/NaturalDisasterPackageDetailPage'
import { InsuranceApplicationFormPage } from '../pages/insurance/InsuranceApplicationFormPage'
import ImprovedInsuranceApplicationPage from '../pages/insurance/ImprovedInsuranceApplicationPage'
import NaturalDisasterApplicationPage from '../pages/insurance/NaturalDisasterApplicationPage'
import { PaymentPage } from '../pages/insurance/PaymentPage'
import { SuccessPage } from '../pages/insurance/SuccessPage'
import MyDocumentsPage from '../pages/documents/MyDocumentsPage'
import ContractDetailPage from '../pages/documents/ContractDetailPage'
import { InsuranceUploadPage } from '../pages/documents/InsuranceUploadPage'
import ProfilePage from '../pages/user/ProfilePage'
import SettingsPage from '../pages/user/SettingsPage'
import { DisasterMapPage } from '../pages/disaster/DisasterMapPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,  
        element: <HomePage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'my-documents',
        element: <MyDocumentsPage />,
      },
      {
        path: 'my-documents/:id',
        element: <ContractDetailPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      // Disaster Map - Interactive weather & insurance map with AI Geo-Analyst
      {
        path: 'disaster-map',
        element: <DisasterMapPage />,
      },
      // Insurance Purchase Flow - Main workflow
      {
        path: 'insurance/upload',
        element: <InsuranceUploadPage />,
      },
      {
        path: 'insurance/application',
        element: <ImprovedInsuranceApplicationPage />,
      },
      {
        path: 'insurance/application-old',
        element: <InsuranceApplicationFormPage />,
      },
      {
        path: 'insurance/payment',
        element: <PaymentPage />,
      },
      {
        path: 'insurance/success',
        element: <SuccessPage />,
      },
      {
        path: 'packages/:id',
        element: <PackageDetailPage />,
      },
      // Natural Disaster Insurance - Detailed pages
      {
        path: 'natural-disaster/:packageId',
        element: <NaturalDisasterPackageDetailPage />,
      },
      {
        path: 'natural-disaster/application',
        element: <NaturalDisasterApplicationPage />,
      },
    ],
  },
  // Auth pages - without layout (no header/footer)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
])