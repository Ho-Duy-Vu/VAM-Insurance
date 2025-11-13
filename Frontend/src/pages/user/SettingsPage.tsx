import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard,
  FileText,
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Eye,
  EyeOff,
  ChevronRight,
  LogOut,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '..\/..\/components\/ui/card'
import { Button } from '..\/..\/components\/ui/button'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('account')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Get user from localStorage
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  // Form states
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: 'Nam'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    insuranceReminders: true,
    paymentAlerts: true
  })

  const handleProfileUpdate = () => {
    // Update profile logic
    console.log('Updating profile:', profileData)
    alert('✅ Cập nhật thông tin thành công!')
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ Mật khẩu xác nhận không khớp!')
      return
    }
    console.log('Changing password')
    alert('✅ Đổi mật khẩu thành công!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      navigate('/')
    }
  }

  const handleDeleteAccount = () => {
    if (confirm('⚠️ CẢNH BÁO: Hành động này không thể hoàn tác. Bạn có chắc muốn xóa tài khoản?')) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      navigate('/')
      alert('Tài khoản đã được xóa')
    }
  }

  const tabs = [
    { id: 'account', name: 'Tài khoản', icon: User },
    { id: 'security', name: 'Bảo mật', icon: Lock },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
    { id: 'preferences', name: 'Tùy chỉnh', icon: Globe },
    { id: 'billing', name: 'Thanh toán', icon: CreditCard },
    { id: 'documents', name: 'Hồ sơ', icon: FileText }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">⚙️ Cài Đặt</h1>
          <p className="text-gray-600 dark:text-gray-400">Quản lý tài khoản và tùy chỉnh hệ thống của bạn</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.name}</span>
                        <ChevronRight className={`w-4 h-4 ml-auto ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    )
                  })}
                </div>

                {/* Logout Button */}
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-600" />
                    Thông tin tài khoản
                  </CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {profileData.fullName.charAt(0) || 'U'}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg border-2 border-blue-500">
                        <Camera className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{profileData.fullName || 'Người dùng'}</h3>
                      <p className="text-sm text-gray-500">{profileData.email}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Thay đổi ảnh đại diện
                      </Button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Họ và tên</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          placeholder="+84 xxx xxx xxx"
                          className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ngày sinh</label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Giới tính</label>
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          rows={3}
                          placeholder="Nhập địa chỉ đầy đủ"
                          className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleProfileUpdate} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-6 h-6 text-blue-600" />
                      Đổi mật khẩu
                    </CardTitle>
                    <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Mật khẩu hiện tại</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Mật khẩu mới</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700">
                      <Lock className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <Trash2 className="w-6 h-6" />
                      Xóa tài khoản
                    </CardTitle>
                    <CardDescription className="text-red-600">
                      Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa vĩnh viễn.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleDeleteAccount} variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa tài khoản của tôi
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-6 h-6 text-blue-600" />
                    Cài đặt thông báo
                  </CardTitle>
                  <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    emailNotifications: 'Thông báo qua Email',
                    smsNotifications: 'Thông báo qua SMS',
                    pushNotifications: 'Thông báo đẩy',
                    marketingEmails: 'Email Marketing',
                    insuranceReminders: 'Nhắc nhở gia hạn bảo hiểm',
                    paymentAlerts: 'Cảnh báo thanh toán'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Nhận thông báo quan trọng qua email'}
                          {key === 'smsNotifications' && 'Nhận tin nhắn SMS khi có cập nhật'}
                          {key === 'pushNotifications' && 'Hiển thị thông báo trên thiết bị'}
                          {key === 'marketingEmails' && 'Nhận ưu đãi và khuyến mãi'}
                          {key === 'insuranceReminders' && 'Nhắc nhở khi sắp hết hạn bảo hiểm'}
                          {key === 'paymentAlerts' && 'Thông báo về các giao dịch thanh toán'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Lưu cài đặt
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                    Tùy chỉnh giao diện
                  </CardTitle>
                  <CardDescription>Điều chỉnh giao diện theo sở thích của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <div>
                        <p className="font-medium">Chế độ tối</p>
                        <p className="text-sm text-gray-500">Giảm mỏi mắt khi sử dụng ban đêm</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
                    <select className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Đơn vị tiền tệ</label>
                    <select className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600">
                      <option value="vnd">VNĐ (Vietnam Dong)</option>
                      <option value="usd">USD (US Dollar)</option>
                    </select>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Lưu tùy chỉnh
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    Phương thức thanh toán
                  </CardTitle>
                  <CardDescription>Quản lý thẻ và lịch sử thanh toán</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-80 mb-2">Visa ****</p>
                    <p className="text-2xl font-mono tracking-wider mb-4">**** **** **** 1234</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-80">Chủ thẻ</p>
                        <p className="font-semibold">{profileData.fullName || 'Người dùng'}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80">Hết hạn</p>
                        <p className="font-semibold">12/25</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Thêm thẻ mới
                  </Button>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Lịch sử thanh toán gần đây</h3>
                    <div className="space-y-3">
                      {[
                        { date: '15/10/2025', amount: '2.000.000đ', package: 'Bảo hiểm Nhân Thọ', status: 'Thành công' },
                        { date: '01/09/2025', amount: '1.500.000đ', package: 'Bảo hiểm Xe Cơ Giới', status: 'Thành công' },
                        { date: '20/08/2025', amount: '3.000.000đ', package: 'Bảo hiểm Sức Khỏe', status: 'Thành công' }
                      ].map((transaction, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium">{transaction.package}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">{transaction.amount}</p>
                            <p className="text-sm text-green-600">{transaction.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Hồ sơ & Tài liệu
                  </CardTitle>
                  <CardDescription>Quản lý các tài liệu đã upload</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'CCCD Mặt trước', date: '10/10/2025', size: '2.5 MB', type: 'Image' },
                      { name: 'CCCD Mặt sau', date: '10/10/2025', size: '2.3 MB', type: 'Image' },
                      { name: 'Giấy đăng ký xe', date: '05/09/2025', size: '1.8 MB', type: 'PDF' },
                      { name: 'Hợp đồng bảo hiểm', date: '01/08/2025', size: '3.2 MB', type: 'PDF' }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border-2 rounded-lg hover:border-blue-500 transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.date} • {doc.size}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {doc.type}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload tài liệu mới
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

    </div>
  )
}

