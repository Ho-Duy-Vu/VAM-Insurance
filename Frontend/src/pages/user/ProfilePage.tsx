import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard,
  Shield,
  FileText,
  LogOut,
  Edit,
  Save,
  X,
  Briefcase,
  DollarSign,
  AlertCircle,
  Check,
  UserPlus,
  Heart,
  Settings,
  Home
} from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  
  // Extended profile information
  address?: string;
  date_of_birth?: string;
  gender?: string;
  id_number?: string;
  place_of_origin?: string;
  occupation?: string;
  monthly_income?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  
  // Insurance preferences
  preferred_payment_method?: string;
  risk_profile?: string;
  notification_preferences?: string;
  
  // Metadata
  avatar_url?: string;
  last_login?: string;
  profile_completed?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedUser(user);
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editedUser) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('❌ Phiên đăng nhập đã hết hạn');
        navigate('/login');
        return;
      }

      // Prepare profile data (exclude system fields)
      const profileData = {
        full_name: editedUser.full_name,
        phone: editedUser.phone,
        address: editedUser.address,
        date_of_birth: editedUser.date_of_birth,
        gender: editedUser.gender,
        id_number: editedUser.id_number,
        place_of_origin: editedUser.place_of_origin,
        occupation: editedUser.occupation,
        monthly_income: editedUser.monthly_income,
        emergency_contact_name: editedUser.emergency_contact_name,
        emergency_contact_phone: editedUser.emergency_contact_phone,
        emergency_contact_relationship: editedUser.emergency_contact_relationship,
        preferred_payment_method: editedUser.preferred_payment_method,
        risk_profile: editedUser.risk_profile,
        notification_preferences: editedUser.notification_preferences,
        avatar_url: editedUser.avatar_url
      };

      // Call backend API to update profile
      const response = await fetch(`http://localhost:8000/users/profile?token=${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Backend error:', errorData);
        throw new Error(errorData.detail || 'Cập nhật thất bại');
      }

      const updatedUser = await response.json();
      
      // Update localStorage with new data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      alert('✅ Cập nhật thông tin thành công!');
      
    } catch (error) {
      console.error('Error saving user data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      alert(`❌ Có lỗi xảy ra: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Header - Modern Design */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* User Info with Avatar */}
            <div className="flex items-center gap-6">
              {/* Enhanced Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  {user.full_name ? (
                    <span className="bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {/* Status Indicator */}
                {user.is_active && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                )}
              </div>
              
              {/* User Details */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                  {user.full_name || 'Chưa cập nhật'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-blue-50">
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/20">
                    <Phone className="w-3 h-3" />
                    {user.phone || 'Chưa có SĐT'}
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/20">
                    <Shield className="w-3 h-3" />
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isEditing ? (
                <Button
                  onClick={handleEditToggle}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold px-6"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa hồ sơ
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-500 hover:bg-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold px-6"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                  <Button
                    onClick={handleEditToggle}
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30 shadow-xl transition-all duration-300 font-semibold px-6"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Content */}
        <Card className="mb-6 shadow-xl border-0 overflow-hidden">
          <CardContent className="p-8">
            {/* Profile Completion Status - Enhanced */}
            {user.profile_completed !== undefined && (
              <div className={`mb-8 p-6 rounded-2xl border-2 shadow-lg ${
                user.profile_completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                  : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    user.profile_completed ? 'bg-green-500' : 'bg-amber-500'
                  } shadow-lg`}>
                    {user.profile_completed ? (
                      <Check className="w-7 h-7 text-white" />
                    ) : (
                      <AlertCircle className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-lg ${
                      user.profile_completed ? 'text-green-900' : 'text-amber-900'
                    }`}>
                      {user.profile_completed ? '🎉 Hồ sơ đã hoàn thiện' : '⚠️ Hồ sơ chưa hoàn thiện'}
                    </p>
                    <p className={`text-sm mt-1 ${
                      user.profile_completed ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {user.profile_completed 
                        ? 'Bạn đã cung cấp đầy đủ thông tin cần thiết để sử dụng dịch vụ tốt nhất'
                        : 'Vui lòng cập nhật thêm thông tin để được hỗ trợ và tư vấn tốt hơn'
                      }
                    </p>
                  </div>
                  {!user.profile_completed && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Hoàn thiện ngay
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Thông tin cá nhân cơ bản */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    Thông tin cá nhân cơ bản
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>Họ và tên</span>
                      <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.full_name || ''}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all text-gray-900 font-medium"
                        placeholder="Nhập họ và tên đầy đủ"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">{user.full_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Email
                    </label>
                    <p className="text-gray-700 font-medium bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-200">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-2 ml-1">🔒 Email không thể thay đổi</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>Số điện thoại</span>
                      <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser?.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all text-gray-900 font-medium"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                        {user.phone || '📞 Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Ngày sinh</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedUser?.date_of_birth || ''}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all text-gray-900 font-medium"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                        {user.date_of_birth || '📅 Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        value={editedUser?.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all text-gray-900 font-medium"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">👨 Nam</option>
                        <option value="Nữ">👩 Nữ</option>
                        <option value="Khác">⚧ Khác</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                        {user.gender ? `${user.gender === 'Nam' ? '👨' : user.gender === 'Nữ' ? '👩' : '⚧'} ${user.gender}` : '⚧ Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Số CCCD/CMND</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.id_number || ''}
                        onChange={(e) => handleInputChange('id_number', e.target.value)}
                        placeholder="Nhập số CCCD/CMND"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all text-gray-900 font-medium"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                        {user.id_number || '🆔 Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin địa chỉ */}
              <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 p-6 rounded-2xl border border-green-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                    Thông tin địa chỉ
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2 gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span>Địa chỉ hiện tại</span>
                      <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedUser?.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Nhập địa chỉ hiện tại (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all text-gray-900 font-medium resize-none"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm min-h-[4rem] flex items-center">
                        {user.address || '🏠 Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Place of Origin */}
                  <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2 gap-2">
                      <Home className="w-4 h-4 text-green-600" />
                      <span>Quê quán</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.place_of_origin || ''}
                        onChange={(e) => handleInputChange('place_of_origin', e.target.value)}
                        placeholder="Nhập quê quán"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all text-gray-900 font-medium"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                        {user.place_of_origin || '🏘️ Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin nghề nghiệp */}
              <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                    Thông tin nghề nghiệp
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Occupation */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2 gap-2">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      <span>Nghề nghiệp</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.occupation || ''}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        placeholder="Nhập nghề nghiệp"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm transition-all text-gray-900 font-medium"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                        {user.occupation || '💼 Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Monthly Income */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2 gap-2">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span>Thu nhập hàng tháng</span>
                    </label>
                    {isEditing ? (
                      <select
                        value={editedUser?.monthly_income || ''}
                        onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm transition-all text-gray-900 font-medium"
                      >
                        <option value="">Chọn mức thu nhập</option>
                        <option value="Dưới 5 triệu">💵 Dưới 5 triệu VNĐ</option>
                        <option value="5-10 triệu">💰 5-10 triệu VNĐ</option>
                        <option value="10-20 triệu">💸 10-20 triệu VNĐ</option>
                        <option value="20-50 triệu">💎 20-50 triệu VNĐ</option>
                        <option value="Trên 50 triệu">🏆 Trên 50 triệu VNĐ</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                        {user.monthly_income || '💵 Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ khẩn cấp */}
              <div className="bg-gradient-to-br from-red-50/50 to-orange-50/30 p-6 rounded-2xl border border-red-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent">
                    Liên hệ khẩn cấp
                  </span>
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Emergency Contact Name */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <UserPlus className="w-4 h-4 mr-2 text-red-600" />
                      Họ tên người liên hệ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.emergency_contact_name || ''}
                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                        placeholder="Nhập họ tên"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.emergency_contact_name || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Emergency Contact Phone */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-red-600" />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser?.emergency_contact_phone || ''}
                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.emergency_contact_phone || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Emergency Contact Relationship */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Heart className="w-4 h-4 mr-2 text-red-600" />
                      Mối quan hệ
                    </label>
                    {isEditing ? (
                      <select
                        value={editedUser?.emergency_contact_relationship || ''}
                        onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn mối quan hệ</option>
                        <option value="Cha">Cha</option>
                        <option value="Mẹ">Mẹ</option>
                        <option value="Vợ/Chồng">Vợ/Chồng</option>
                        <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                        <option value="Con">Con</option>
                        <option value="Bạn">Bạn</option>
                        <option value="Đồng nghiệp">Đồng nghiệp</option>
                        <option value="Khác">Khác</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.emergency_contact_relationship || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tùy chọn bảo hiểm */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  Tùy chọn bảo hiểm
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Preferred Payment Method */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4 mr-2 text-orange-600" />
                      Phương thức thanh toán ưa thích
                    </label>
                    {isEditing ? (
                      <select
                        value={editedUser?.preferred_payment_method || ''}
                        onChange={(e) => handleInputChange('preferred_payment_method', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn phương thức</option>
                        <option value="Tiền mặt">Tiền mặt</option>
                        <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
                        <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                        <option value="Ví điện tử">Ví điện tử</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.preferred_payment_method || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Risk Profile */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Shield className="w-4 h-4 mr-2 text-orange-600" />
                      Mức độ rủi ro
                    </label>
                    {isEditing ? (
                      <select
                        value={editedUser?.risk_profile || ''}
                        onChange={(e) => handleInputChange('risk_profile', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn mức độ rủi ro</option>
                        <option value="Thấp">Thấp (An toàn)</option>
                        <option value="Trung bình">Trung bình</option>
                        <option value="Cao">Cao (Tích cực)</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.risk_profile || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin hệ thống */}
              {(user.created_at || user.last_login) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Thông tin hệ thống
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Created At */}
                    {user.created_at && (
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                          Ngày tham gia
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                          {new Date(user.created_at).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}

                    {/* Last Login */}
                    {user.last_login && (
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                          Lần đăng nhập cuối
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                          {new Date(user.last_login).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/my-documents')}
          >
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Hợp đồng của tôi</h3>
              <p className="text-sm text-gray-600">Xem lịch sử mua bảo hiểm</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/products')}
          >
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Sản phẩm bảo hiểm</h3>
              <p className="text-sm text-gray-600">Khám phá gói bảo hiểm</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/insurance/upload')}
          >
            <CardContent className="p-6 text-center">
              <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Mua bảo hiểm mới</h3>
              <p className="text-sm text-gray-600">Bắt đầu quy trình mua</p>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

