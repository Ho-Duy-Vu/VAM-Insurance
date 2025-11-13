import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '..\/..\/components\/ui/card';
import { Button } from '..\/..\/components\/ui/button';
import { 
  User, 
  Mail, 
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
  UserCheck,
  Briefcase,
  DollarSign,
  AlertCircle,
  Check,
  UserPlus,
  IdCard,
  Heart,
  Settings,
  Lock
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trang Cá Nhân</h1>
          <p className="text-gray-600">Quản lý thông tin và tài khoản của bạn</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                  <CardDescription className="text-blue-100">{user.email}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    onClick={handleEditToggle}
                    variant="outline"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                    <Button
                      onClick={handleEditToggle}
                      variant="outline"
                      className="bg-white text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Profile Completion Status */}
            {user.profile_completed !== undefined && (
              <div className={`mb-6 p-4 rounded-lg ${user.profile_completed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border`}>
                <div className="flex items-center gap-3">
                  {user.profile_completed ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <div>
                    <p className={`font-medium ${user.profile_completed ? 'text-green-800' : 'text-yellow-800'}`}>
                      {user.profile_completed ? 'Hồ sơ đã hoàn thiện' : 'Hồ sơ chưa hoàn thiện'}
                    </p>
                    <p className={`text-sm ${user.profile_completed ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user.profile_completed 
                        ? 'Bạn đã cung cấp đầy đủ thông tin cần thiết'
                        : 'Vui lòng cập nhật thêm thông tin để được hỗ trợ tốt hơn'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Thông tin cá nhân cơ bản */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Thông tin cá nhân cơ bản
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.full_name || ''}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.full_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      Email
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser?.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.phone || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedUser?.date_of_birth || ''}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.date_of_birth || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        value={editedUser?.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.gender || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <IdCard className="w-4 h-4 mr-2 text-blue-600" />
                      Số CCCD/CMND
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.id_number || ''}
                        onChange={(e) => handleInputChange('id_number', e.target.value)}
                        placeholder="Nhập số CCCD/CMND"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.id_number || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin địa chỉ */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Thông tin địa chỉ
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      Địa chỉ hiện tại <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedUser?.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Nhập địa chỉ hiện tại"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.address || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Place of Origin */}
                  <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      Quê quán
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.place_of_origin || ''}
                        onChange={(e) => handleInputChange('place_of_origin', e.target.value)}
                        placeholder="Nhập quê quán"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.place_of_origin || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin nghề nghiệp */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Thông tin nghề nghiệp
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Occupation */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                      Nghề nghiệp
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser?.occupation || ''}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        placeholder="Nhập nghề nghiệp"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.occupation || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Monthly Income */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                      Thu nhập hàng tháng
                    </label>
                    {isEditing ? (
                      <select
                        value={editedUser?.monthly_income || ''}
                        onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn mức thu nhập</option>
                        <option value="Dưới 5 triệu">Dưới 5 triệu VNĐ</option>
                        <option value="5-10 triệu">5-10 triệu VNĐ</option>
                        <option value="10-20 triệu">10-20 triệu VNĐ</option>
                        <option value="20-50 triệu">20-50 triệu VNĐ</option>
                        <option value="Trên 50 triệu">Trên 50 triệu VNĐ</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                        {user.monthly_income || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ khẩn cấp */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Thông tin liên hệ khẩn cấp
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

