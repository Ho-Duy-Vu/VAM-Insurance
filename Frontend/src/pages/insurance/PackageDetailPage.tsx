import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById, formatPrice } from '../../data/insurancePackages';
import { useInsuranceStore } from '../../store/insurance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Shield, 
  FileText,
  HelpCircle,
  Calendar,
  DollarSign,
  Star,
  Package,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';

export const PackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedPackage, setCurrentStep } = useInsuranceStore();
  const [activeTab, setActiveTab] = useState('overview');

  const packageData = id ? getPackageById(id) : null;

  useEffect(() => {
    if (!packageData) {
      navigate('/');
    }
  }, [packageData, navigate]);

  const handleBuyNow = () => {
    if (packageData) {
      setSelectedPackage(packageData);
      setCurrentStep('upload');
      navigate('/insurance/upload');
    }
  };

  if (!packageData) {
    return null;
  }

  const faqs = [
    {
      question: 'Điều kiện tham gia bảo hiểm là gì?',
      answer: 'Độ tuổi từ 18-65 tuổi, đang sinh sống tại Việt Nam và có đầy đủ giấy tờ tùy thân hợp lệ.'
    },
    {
      question: 'Hợp đồng có hiệu lực khi nào?',
      answer: 'Hợp đồng có hiệu lực ngay sau khi thanh toán thành công và nhận được xác nhận từ công ty bảo hiểm.'
    },
    {
      question: 'Có thể hủy hợp đồng không?',
      answer: 'Bạn có thể hủy hợp đồng trong vòng 21 ngày kể từ ngày ký kết và được hoàn lại 100% phí đã đóng.'
    },
    {
      question: 'Thời gian chờ bảo hiểm là bao lâu?',
      answer: 'Thời gian chờ tùy theo từng loại bảo hiểm, thông thường là 30-90 ngày đối với bảo hiểm sức khỏe.'
    },
    {
      question: 'Làm thế nào để yêu cầu bồi thường?',
      answer: 'Liên hệ hotline 1900 xxxx hoặc gửi yêu cầu qua email support@insurance.vn kèm theo hồ sơ yêu cầu bồi thường.'
    }
  ];

  const exclusions = [
    'Các bệnh có sẵn trước khi tham gia bảo hiểm',
    'Tai nạn do say rượu, sử dụng chất kích thích',
    'Tự gây thương tích, tự tử hoặc cố ý gây nguy hiểm',
    'Chiến tranh, bạo loạn, khủng bố',
    'Phóng xạ hạt nhân',
    'Điều trị thẩm mỹ không do tai nạn',
    'Thai sản trong thời gian chờ bảo hiểm'
  ];

  const requiredDocs = packageData.requiredDocuments || [
    'CMND/CCCD (bản photo công chứng)',
    'Giấy khám sức khỏe (nếu cần)',
    'Đơn đề nghị bảo hiểm đã điền đầy đủ'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Package Header */}
        <Card className="mb-6 overflow-hidden bg-white border-2 border-gray-200">
          <CardHeader className="p-8 pb-4">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Icon with colored background */}
              <div className="w-24 h-24 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center shadow-lg flex-shrink-0">
                <Package className="w-12 h-12 text-blue-600" />
              </div>
              
              <div className="flex-1 w-full">
                {/* Featured Badge */}
                {packageData.featured && (
                  <div className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold mb-3">
                    <Star className="w-4 h-4" />
                    Nổi bật
                  </div>
                )}
                
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {packageData.name}
                </CardTitle>
                <CardDescription className="text-gray-700 mb-6 font-medium text-sm md:text-base">
                  {packageData.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-600 font-medium">Phí bảo hiểm</p>
                      <p className="text-lg md:text-xl font-bold text-blue-600 truncate">
                        {formatPrice(packageData.price)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-600 font-medium">Thời hạn</p>
                      <p className="text-base md:text-lg font-bold text-gray-900 truncate">{packageData.period}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-green-50 rounded-lg border border-green-200 sm:col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-600 font-medium">Quyền lợi</p>
                      <p className="text-base md:text-lg font-bold text-gray-900 truncate">{packageData.coverage}</p>
                    </div>
                  </div>
                </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto gap-2">
            <TabsTrigger value="overview" className="text-xs md:text-sm py-2.5">
              <FileText className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Tổng Quan</span>
              <span className="sm:hidden">Tổng Quan</span>
            </TabsTrigger>
            <TabsTrigger value="benefits" className="text-xs md:text-sm py-2.5">
              <CheckCircle2 className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Quyền Lợi</span>
              <span className="sm:hidden">Quyền Lợi</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="text-xs md:text-sm py-2.5">
              <Shield className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Điều Khoản</span>
              <span className="sm:hidden">Điều Khoản</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-xs md:text-sm py-2.5">
              <HelpCircle className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Câu Hỏi</span>
              <span className="sm:hidden">Câu Hỏi</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <span className="text-base md:text-xl">Giới Thiệu Chung</span>
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-3 md:mb-4 leading-relaxed font-medium text-sm md:text-base">
                    {packageData.name} là giải pháp bảo hiểm toàn diện được thiết kế đặc biệt để bảo vệ bạn và gia đình 
                    trước những rủi ro không mong muốn trong cuộc sống.
                  </p>
                  <p className="mb-3 md:mb-4 leading-relaxed font-medium text-sm md:text-base">
                    Với quyền lợi bảo hiểm lên đến <strong className="text-gray-900">{packageData.coverage}</strong>, bạn có thể an tâm tuyệt đối 
                    về tài chính khi đối mặt với các tình huống khẩn cấp.
                  </p>
                  <p className="leading-relaxed font-medium text-sm md:text-base">
                    Chương trình được thiết kế phù hợp với mọi lứa tuổi và điều kiện sức khỏe, 
                    đảm bảo mang lại sự bảo vệ tốt nhất cho bạn và những người thân yêu.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <span className="text-base md:text-xl">Hồ Sơ Cần Thiết</span>
                </h2>
                <div className="space-y-2 md:space-y-3">
                  {requiredDocs.map((doc, index) => (
                    <div key={index} className="flex items-start gap-2 md:gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium text-sm md:text-base">{doc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-4 md:space-y-6">
            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                  <span className="text-base md:text-xl">Quyền Lợi Bảo Hiểm</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {packageData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium text-sm md:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <span className="text-base md:text-xl">Mức Bồi Thường</span>
                </h2>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 md:p-8 border-2 border-blue-200">
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-gray-700 font-semibold mb-2">Mức bồi thường tối đa</p>
                    <p className="text-2xl md:text-4xl font-bold text-blue-600 mb-3 md:mb-4">
                      {packageData.coverage}
                    </p>
                    <p className="text-xs md:text-sm text-gray-700 font-medium">
                      Bồi thường nhanh chóng trong vòng 7-10 ngày làm việc
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms Tab */}
          <TabsContent value="terms" className="space-y-4 md:space-y-6">
            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <span className="text-base md:text-xl">Điều Khoản & Điều Kiện</span>
                </h2>
                <div className="prose max-w-none text-gray-700 space-y-4 md:space-y-6">
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">1. Phạm Vi Bảo Hiểm</h3>
                    <p className="font-medium text-sm md:text-base">
                      Hợp đồng bảo hiểm có hiệu lực trên toàn lãnh thổ Việt Nam và một số quốc gia có thỏa thuận 
                      với công ty bảo hiểm.
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">2. Thời Gian Chờ</h3>
                    <p className="font-medium text-sm md:text-base">
                      Thời gian chờ bảo hiểm là khoảng thời gian từ khi hợp đồng có hiệu lực đến khi người được 
                      bảo hiểm có thể yêu cầu bồi thường. Thời gian này thường là 30 ngày đối với tai nạn và 
                      90 ngày đối với bệnh tật.
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">3. Nghĩa Vụ Của Bên Mua Bảo Hiểm</h3>
                    <ul className="list-disc list-inside space-y-2 font-medium text-sm md:text-base">
                      <li>Khai báo trung thực, đầy đủ thông tin khi tham gia bảo hiểm</li>
                      <li>Đóng phí bảo hiểm đầy đủ và đúng hạn</li>
                      <li>Thông báo ngay cho công ty bảo hiểm khi có sự kiện bảo hiểm xảy ra</li>
                      <li>Tuân thủ các quy định trong hợp đồng bảo hiểm</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                  </div>
                  <span className="text-base md:text-xl">Trường Hợp Loại Trừ</span>
                </h2>
                <div className="space-y-2 md:space-y-3">
                  {exclusions.map((exclusion, index) => (
                    <div key={index} className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium text-sm md:text-base">{exclusion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4 md:space-y-6">
            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <span className="text-base md:text-xl">Câu Hỏi Thường Gặp</span>
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b-2 border-gray-200 pb-4 last:border-0">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2 text-sm md:text-base">
                        <span className="text-blue-600 font-bold flex-shrink-0">Q{index + 1}.</span>
                        <span>{faq.question}</span>
                      </h3>
                      <p className="text-gray-700 ml-6 md:ml-8 font-medium leading-relaxed text-sm md:text-base">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Cần Hỗ Trợ Thêm?</h2>
                <p className="text-gray-700 mb-4 font-medium text-sm md:text-base">
                  Nếu bạn có thắc mắc khác, đừng ngần ngại liên hệ với chúng tôi qua:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-700 font-semibold">Hotline</p>
                      <p className="font-bold text-gray-900 text-base md:text-lg">1900 xxxx</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-700 font-semibold">Email</p>
                      <p className="font-bold text-gray-900 text-base md:text-lg truncate">support@insurance.vn</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-md">Sẵn Sàng Bảo Vệ Bản Thân?</h2>
                <p className="text-blue-50 font-medium drop-shadow text-sm md:text-base">
                  Tham gia ngay hôm nay để nhận được sự bảo vệ toàn diện
                </p>
              </div>
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full md:w-auto"
              >
                <Shield className="w-5 h-5 mr-2" />
                Mua Ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


