import { Shield, Target, Users, Zap, Award, Globe, Heart } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import hoDuyVuImg from '../../assets/team/ho-duy-vu.jpg'
import nguyenPhanDucMinhImg from '../../assets/team/nguyen-phan-duc-minh.jpg'
import nguyenHoangAnhImg from '../../assets/team/nguyenhoanganh.jpg'
import nguyenChiQuyetImg from '../../assets/team/Nguyenchiquyet.jpg'

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Uy tín & Tin cậy',
      description: 'Cam kết bảo vệ quyền lợi khách hàng với sự minh bạch cao nhất',
      color: 'text-trust-600',
      bgColor: 'bg-trust-50'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Công nghệ AI tiên tiến',
      description: 'Ứng dụng Gemini AI để phân tích và tư vấn chính xác',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Tận tâm với khách hàng',
      description: 'Hỗ trợ 24/7, luôn đặt lợi ích khách hàng lên hàng đầu',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Chất lượng hàng đầu',
      description: 'Đạt nhiều giải thưởng uy tín trong ngành bảo hiểm',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const stats = [
    { number: '100K+', label: 'Khách hàng tin tưởng', icon: <Users className="w-8 h-8" /> },
    { number: '500+', label: 'Gói bảo hiểm', icon: <Shield className="w-8 h-8" /> },
    { number: '99.8%', label: 'Hài lòng', icon: <Heart className="w-8 h-8" /> },
    { number: '24/7', label: 'Hỗ trợ', icon: <Zap className="w-8 h-8" /> }
  ]

  const team = [
    {
      name: 'Hồ Duy Vũ',
      role: 'Head of Technology',
      description: 'Kiến trúc sư công nghệ & Phát triển hệ thống',
      avatar: hoDuyVuImg,
      contributions: [
        'Thiết kế kiến trúc hệ thống microservices',
        'Phát triển Backend API với FastAPI',
        'Tối ưu hiệu suất và bảo mật'
      ],
      tech: ['Python', 'FastAPI', 'PostgreSQL', 'Docker']
    },
    {
      name: 'Nguyễn Phan Đức Minh',
      role: 'Lead AI Engineer',
      description: 'Chuyên gia AI & Machine Learning',
      avatar: nguyenPhanDucMinhImg,
      contributions: [
        'Tích hợp Gemini AI cho phân tích tài liệu',
        'Xây dựng chatbot tư vấn thông minh',
        'Phát triển mô hình dự đoán rủi ro'
      ],
      tech: ['Gemini AI', 'TensorFlow', 'PyTorch', 'NLP']
    },
    {
      name: 'Nguyễn Hoàng Anh',
      role: 'Senior AI Developer',
      description: 'Chuyên gia AI & Deep Learning',
      avatar: nguyenHoangAnhImg,
      contributions: [
        'Phân tích dữ liệu địa lý thiên tai',
        'Xây dựng hệ thống đề xuất bảo hiểm',
        'Tối ưu thuật toán Machine Learning'
      ],
      tech: ['Python', 'Scikit-learn', 'Computer Vision', 'Data Analytics']
    },
    {
      name: 'Nguyễn Chí Quyết',
      role: 'Senior AI Engineer',
      description: 'Quản lý dự án AI & Phát triển mô hình',
      avatar: nguyenChiQuyetImg,
      contributions: [
        'Quản lý pipeline ML/AI',
        'Phát triển API tích hợp AI',
        'Giám sát và đánh giá mô hình'
      ],
      tech: ['MLOps', 'LangChain', 'Vector DB', 'API Design']
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-trust-600 via-trust-700 to-blue-900 text-white py-24 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-medium">Nền tảng bảo hiểm AI hàng đầu Việt Nam</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Về <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">VAM Insurance</span>
              </h1>
              <p className="text-xl text-trust-50 leading-relaxed max-w-3xl mx-auto mb-8">
                Chúng tôi đang cách mạng hóa ngành bảo hiểm với công nghệ AI tiên tiến, 
                giúp mọi người dễ dàng tiếp cận và lựa chọn gói bảo hiểm phù hợp nhất.
              </p>
              
              {/* Stats in Hero */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-trust-100 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team - MAIN SECTION */}
        <section className="relative bg-white py-20">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-trust-600 to-blue-600 text-white rounded-full">
                <span className="text-sm font-semibold">Đội Ngũ Phát Triển</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Những Người Tạo Nên <span className="bg-gradient-to-r from-trust-600 to-blue-600 bg-clip-text text-transparent">VAM Insurance</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Đội ngũ chuyên gia công nghệ đam mê đổi mới và mong muốn mang lại giá trị thực cho khách hàng
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {team.map((member, idx) => (
                <Card 
                  key={idx} 
                  className="group relative overflow-hidden bg-white border-2 border-transparent hover:border-trust-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Avatar Section */}
                    <div className="relative bg-gradient-to-br from-trust-600 to-blue-600 p-10">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all"></div>
                      <div className="relative w-44 h-44 mx-auto overflow-hidden rounded-full border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-xs font-semibold">Core Team</span>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 text-center min-h-[56px] flex items-center justify-center">{member.name}</h3>
                      <p className="text-trust-600 text-sm font-semibold mb-3 text-center">{member.role}</p>
                      <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed min-h-[60px]">{member.description}</p>
                      
                      {/* Contributions */}
                      <div className="bg-gradient-to-br from-trust-50 to-blue-50 rounded-xl p-4 mb-4 flex-1">
                        <h4 className="font-semibold text-xs text-trust-700 mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Đóng góp chính
                        </h4>
                        <ul className="space-y-2">
                          {member.contributions.map((contrib, i) => (
                            <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                              <span className="text-trust-600 mt-0.5 flex-shrink-0">•</span>
                              <span className="flex-1 leading-relaxed">{contrib}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.tech.map((tech, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 bg-white border border-trust-200 text-trust-700 text-xs font-medium rounded-full hover:bg-trust-50 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Values Combined */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
              <Card className="group relative border-2 border-trust-200 hover:border-trust-400 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-trust-500 to-trust-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Làm cho bảo hiểm trở nên dễ hiểu và dễ tiếp cận hơn cho mọi người thông qua 
                    công nghệ AI, mang lại sự bảo vệ tốt nhất mà không cần quy trình phức tạp.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Tầm nhìn</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Trở thành nền tảng bảo hiểm AI hàng đầu Việt Nam, nơi công nghệ kết hợp 
                    hoàn hảo với dịch vụ con người, mang lại trải nghiệm tốt nhất.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Core Values */}
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, idx) => (
                <Card 
                  key={idx} 
                  className="group border-2 border-gray-100 hover:border-trust-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 ${value.bgColor} rounded-2xl flex items-center justify-center ${value.color} mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

