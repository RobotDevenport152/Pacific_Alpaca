import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Trophy, Tv, Leaf, PawPrint, Thermometer, Feather, Droplets, Bug, Zap, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';

const AUTHORITY = [
  {
    icon: Trophy,
    titleZh: '胡润至尚优品2023金奖', titleEn: 'Hurun Top Luxury 2023',
    descZh: '第十九届"软装家居"新秀奖', descEn: '19th Soft Furnishings Rising Star',
  },
  {
    icon: Tv,
    titleZh: 'CGTN 国际频道专题报道', titleEn: 'CGTN International Feature',
    descZh: '30+主流媒体关注', descEn: 'Coverage by 30+ media outlets',
  },
  {
    icon: Leaf,
    titleZh: '新西兰政府银蕨认证', titleEn: 'NZ Silver Fern Certified',
    descZh: 'NZFM101008', descEn: 'Licence No. NZFM101008',
  },
  {
    icon: PawPrint,
    titleZh: '国际羊驼协会唯一企业成员', titleEn: 'IAA Corporate Member',
    descZh: 'Cert. 02-041', descEn: 'Certificate 02-041',
  },
];

const WHY_ALPACA = [
  { icon: Thermometer, titleZh: '保暖', titleEn: 'Warmth', valueZh: '3倍于羊毛', valueEn: '3× warmer than wool' },
  { icon: Feather, titleZh: '轻盈', titleEn: 'Light', valueZh: '仅羊毛被重量30%', valueEn: '30% of wool duvet weight' },
  { icon: Droplets, titleZh: '排潮', titleEn: 'Moisture', valueZh: '可吸收35%水蒸气', valueEn: '35% vapor absorption' },
  { icon: Bug, titleZh: '抑螨', titleEn: 'Anti-mite', valueZh: '趋避率64.37%（实验数据）', valueEn: '64.37% avoidance rate (tested)' },
  { icon: Zap, titleZh: '阻电', titleEn: 'Anti-static', valueZh: '天然抗静电，不吸灰尘', valueEn: 'Natural anti-static fiber' },
];

export default function ChinaLandingPage() {
  // FIX: added locale from useApp — page previously had zero locale awareness
  const { locale } = useApp();

  const copyWechat = () => {
    navigator.clipboard.writeText('pacificalpacas');
    // FIX: toast now respects locale
    toast.success(locale === 'zh' ? '微信号已复制！' : 'WeChat ID copied!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-6xl mb-4 leading-tight">
              新西兰顶级羊驼被 · 官方旗舰
            </h1>
            <p className="font-body text-primary-foreground/70 text-lg mb-8">
              太平洋羊驼 — 新西兰最大羊驼纤维供应商，23年品牌积淀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="px-10 py-4 bg-accent text-accent-foreground font-body font-semibold rounded-sm tracking-wider hover:bg-accent/90 transition">
                立即选购
              </Link>
              <button onClick={copyWechat} className="px-10 py-4 border border-gold/40 text-gold font-body rounded-sm tracking-wider hover:bg-gold/10 transition">
                联系微信客服
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Authority Signals */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {AUTHORITY.map((item, i) => (
              <motion.div key={item.titleZh} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-lg border border-border p-6 text-center hover:border-gold/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-sm font-semibold mb-1">
                  {locale === 'zh' ? item.titleZh : item.titleEn}
                </h3>
                <p className="text-xs text-muted-foreground font-body">
                  {locale === 'zh' ? item.descZh : item.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Alpaca */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl text-center mb-10">
            {locale === 'zh' ? '为什么选择羊驼纤维' : 'Why Alpaca Fiber'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {WHY_ALPACA.map((item, i) => (
              <motion.div key={item.titleZh} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="text-center">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-sm font-semibold mb-1">
                  {locale === 'zh' ? item.titleZh : item.titleEn}
                </h3>
                <p className="text-xs text-primary-foreground/60 font-body">
                  {locale === 'zh' ? item.valueZh : item.valueEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Traceability */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShieldCheck className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="font-display text-3xl mb-4">每一床被子都有溯源码</h2>
            <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">
              扫描产品上的溯源码，即可查看您的羊驼被来自哪个牧场、哪批次纤维、经过怎样的加工流程。透明可追溯，是我们对品质的承诺。
            </p>
            <Link to="/traceability" className="inline-block px-8 py-3 bg-accent text-accent-foreground font-body rounded-sm hover:bg-accent/90 transition">
              查看溯源示例
            </Link>
          </motion.div>
        </div>
      </section>

      {/* WeChat Contact */}
      <section className="py-16 bg-cream-dark">
        <div className="container mx-auto px-6 text-center max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MessageCircle className="w-16 h-16 text-gold mx-auto mb-4" />
            <h2 className="font-display text-2xl mb-2">微信客服</h2>
            <p className="font-body text-lg font-semibold mb-2">pacificalpacas</p>
            <p className="font-body text-sm text-muted-foreground mb-6">
              添加微信，享专属中文服务、报价咨询及优先发货
            </p>
            <button onClick={copyWechat}
              className="px-10 py-4 bg-accent text-accent-foreground font-body font-semibold rounded-sm tracking-wider hover:bg-accent/90 transition">
              复制微信号
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
