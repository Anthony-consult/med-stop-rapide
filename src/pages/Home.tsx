import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TextType from "@/components/TextType";
import RotatingText from "@/components/RotatingText";
import CardNav from "@/components/CardNav";
import StructuredData from "@/components/StructuredData";
import {
  ClipboardCheck,
  FileText,
  Stethoscope,
  CheckCircle,
  Shield,
  Users,
  CreditCard,
  Headphones,
  ArrowRight,
  Lock,
  Timer,
  Award,
  Sparkles,
  Clock,
  Phone,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const trustBadges = [
    {
      icon: Users,
      title: "Médecins inscrits à l'Ordre",
      description: "Professionnels certifiés",
    },
    {
      icon: Shield,
      title: "Hébergement HDS recommandé",
      description: "Sécurité maximale",
    },
    {
      icon: CreditCard,
      title: "Paiement sécurisé",
      description: "Protection des données",
    },
    {
      icon: Headphones,
      title: "Support réactif",
      description: "Assistance 24/7",
    },
  ];

  const steps = [
    {
      icon: ClipboardCheck,
      title: "Remplissez vos symptômes et vos informations",
      description: "Répondez à des questions simples en ligne pour obtenir un diagnostic rapide et précis.",
    },
    {
      icon: Users,
      title: "Choisissez votre médecin",
      description: "Choisissez la ville d'un de nos médecins partenaires pendant le diagnostic en ligne.",
    },
    {
      icon: CreditCard,
      title: "Payez en toute sécurité",
      description: "Effectuez votre paiement de manière sécurisée sur notre plateforme pour accéder à nos services médicaux.",
    },
    {
      icon: FileText,
      title: "Attendez votre arrêt maladie",
      description: "Votre dossier est transmis à l'un de nos médecins partenaires. Recevez votre arrêt maladie par mail le jour même (7j/7).",
    },
  ];

  const benefits = [
    "Service 24/7, partout en France",
    "Processus simple et guidé",
    "Données protégées, confidentialité stricte",
    "Tarif unique et transparent",
  ];

  const faqs = [
    {
      question: "Est-ce qu'un arrêt maladie en ligne est légal ?",
      answer: "Oui. Les arrêts maladie délivrés en ligne sont reconnus par la législation française, à condition qu'ils soient validés par un médecin agréé. Chaque document transmis par Consult-Chrono respecte le cadre légal en vigueur et est accepté par les employeurs et la sécurité sociale.",
    },
    {
      question: "Quels types de maladies sont concernés ?",
      answer: "Nos médecins peuvent délivrer un arrêt maladie pour les affections courantes comme la gastro-entérite, la fatigue, le stress, la migraine, ou les symptômes de Covid. Les cas graves nécessitant un suivi en présentiel ne sont pas concernés.",
    },
    {
      question: "Faut-il un médecin traitant pour obtenir un arrêt maladie en ligne ?",
      answer: "Non. Vous pouvez faire la démarche directement via notre formulaire sécurisé. Nos médecins partenaires vérifient les informations et valident votre document sans avoir besoin d'un médecin traitant.",
    },
    {
      question: "Combien de temps faut-il pour recevoir mon arrêt ?",
      answer: "En général, la réponse intervient sous 24 heures après validation de votre formulaire. Vous recevez directement votre document médical par email.",
    },
    {
      question: "Mon arrêt maladie en ligne sera-t-il accepté par mon employeur ?",
      answer: "Oui. Les documents émis via Consult-Chrono sont conformes au format légal d'un arrêt de travail et peuvent être transmis à votre employeur ou à la sécurité sociale comme un arrêt classique.",
    },
    {
      question: "Quand ne pas utiliser Consult-Chrono ?",
      answer: "En cas de symptômes graves ou d'urgence (douleur thoracique intense, difficulté respiratoire sévère, perte de conscience), appelez immédiatement le 15 (SAMU). Notre service est destiné aux affections courantes sans signe de gravité.",
    },
  ];

  const navItems = [
    {
      label: "Accueil",
      bgColor: "linear-gradient(135deg, #008AA4 0%, #00B4D8 50%, #90E0EF 100%)",
      textColor: "#fff",
      links: [
        { label: "Accueil", ariaLabel: "Page d'accueil", onClick: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
        { label: "Comment ça marche", ariaLabel: "Comment ça marche", onClick: () => { navigate('/'); setTimeout(() => { document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' }); }, 100); } }
      ]
    },
    {
      label: "Obtenir mon arrêt", 
      bgColor: "linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)",
      textColor: "#fff",
      links: [
        { label: "Consultation", ariaLabel: "Consultation médicale", onClick: () => navigate('/consultation') },
        { label: "Certificats", ariaLabel: "Certificats médicaux", onClick: () => navigate('/consultation') }
      ]
    },
    {
      label: "À propos",
      bgColor: "linear-gradient(135deg, #11998E 0%, #38EF7D 50%, #C6FFDD 100%)", 
      textColor: "#fff",
      links: [
        { label: "Notre mission", ariaLabel: "Notre mission", onClick: () => navigate('/a-propos') },
        { label: "Nos valeurs", ariaLabel: "Nos valeurs", onClick: () => navigate('/a-propos') }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <StructuredData faqs={faqs} />
      
      {/* Card Navigation */}
      <CardNav
        logo="/logo-big.png"
        logoAlt="Consult-Chrono Logo"
        items={navItems}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#0A6ABF"
        buttonTextColor="#fff"
        ease="power3.out"
      />

      {/* Hero Section - Ultra Modern */}
      <section className="relative overflow-hidden py-12 bg-gradient-to-br from-blue-50/30 via-white to-pink-50/30 pt-28 pb-10 md:pt-40">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 relative z-10">

          {/* Main Content */}
          <div className="relative flex flex-col md:flex-row gap-12 items-center">
            {/* Left side - Content */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-[#008AA4] to-[#00B4D8] bg-clip-text text-transparent">
                  Un arrêt maladie
                </span>
                <br />
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#008AA4]/20 to-[#00B4D8]/20 blur-xl"></span>
                  <span className="relative bg-gradient-to-r from-[#008AA4] to-[#00B4D8] bg-clip-text text-transparent font-extrabold">
                    en 4 minutes.
                  </span>
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 mb-4 leading-relaxed">
                Répondez à quelques questions, validez votre demande,
                <br className="hidden sm:block" />
                et recevez votre document médical directement par email.
              </p>
              
              <p className="text-base font-semibold text-[#008AA4] mb-8">
                Simple, légal, sans attente.
              </p>
              
              {/* CTA Buttons - Ultra Modern */}
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  onClick={() => navigate("/consultation")}
                  className="group relative isolate overflow-hidden bg-gradient-to-r from-[#008AA4] to-[#00B4D8] hover:shadow-[0_8px_24px_rgba(0,138,164,0.25)] text-white px-8 py-6 sm:px-10 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-[0.99]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-3">
                    <Stethoscope className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    Obtenir mon arrêt maladie
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  Paiement sécurisé — Remboursé si non éligible
                </p>
              </div>
              <Button
                size="lg"
                variant="outline"
                  onClick={() => {
                    document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-6 sm:px-8 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-[0.99]"
              >
                  <span className="flex items-center gap-2">
                Comment ça marche ?
                    <Clock className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </span>
              </Button>
              </div>

              {/* Trust Indicators - Modern Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-[#F4FBFC] border border-[#E6F7FA] rounded-xl px-4 py-3 transition-transform hover:-translate-y-0.5 cursor-default">
                  <Lock className="h-5 w-5 text-[#008AA4] flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800">RGPD</span>
                </div>
                <div className="flex items-center gap-3 bg-[#F4FBFC] border border-[#E6F7FA] rounded-xl px-4 py-3 transition-transform hover:-translate-y-0.5 cursor-default">
                  <Clock className="h-5 w-5 text-[#008AA4] flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800">Réponse 24h</span>
                </div>
                <div className="flex items-center gap-3 bg-[#F4FBFC] border border-[#E6F7FA] rounded-xl px-4 py-3 transition-transform hover:-translate-y-0.5 cursor-default col-span-2 md:col-span-1">
                  <Shield className="h-5 w-5 text-[#008AA4] flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800">Légal & conforme</span>
                </div>
              </div>
            </div>

            {/* Right side - Doctor image and price bubble */}
            <div className="flex items-start gap-8 md:gap-12 flex-shrink-0">
              {/* Doctor Image with Glow Effect */}
              <div className="relative w-40 md:w-48 lg:w-56">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                <img
                  src="/doctor.png"
                  alt="Médecin — illustration de réassurance"
                  className="relative w-full h-auto object-contain"
                />
                <figcaption className="sr-only">
                  Médecin — illustration de réassurance
                </figcaption>
              </div>
              
              {/* Price Bubble - Right side, larger with bounce animation */}
              <div className="w-32 h-32 md:w-40 md:h-40 animate-bounce-slow drop-shadow-2xl">
                <img
                  src="/tarif-bubble.png"
                  alt="Tarif 14€"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Statistics Section - Mobile Only */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3/4 w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl p-4 md:p-6 text-center shadow-2xl z-20 md:hidden">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                
                {/* Stats content */}
                <div className="flex-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">800 000</div>
                  <div className="text-sm text-gray-800 font-medium mb-3">certificats médicaux générés en France</div>
                  
                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer for overlapping card - only needed on mobile */}
          <div className="h-32 md:h-0"></div>
        </div>
      </section>

      {/* Process Section - Ultra Modern */}
      <section id="process" className="py-12 md:py-20 bg-white relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-pink-50/20 pointer-events-none"></div>
        
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Simple & Rapide</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              4 étapes simples pour obtenir votre arrêt maladie en ligne
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="group relative">
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 -z-10"></div>
                  )}
                  
                  <div className="relative bg-white/80 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer hover:border-purple-200 h-full flex flex-col">
                    {/* Number Badge */}
                    <div className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-lg shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    {index + 1}
                    </div>
                    
                    {/* Icon Container */}
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center flex-shrink-0">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-center flex-grow">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reassurance Banner with Rotating Text - Centered */}
      <section className="py-8 md:py-12 bg-white relative">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900 flex-shrink-0">
              Service
            </span>
            <RotatingText
              texts={['100% Légal', 'Certifié HDS', 'Conforme RGPD', 'Sécurisé SSL', 'Médecins Diplômés']}
              mainClassName="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold px-4 py-2 rounded-lg text-lg shadow-lg flex-shrink-0"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-8 md:py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/20 via-transparent to-blue-50/20 pointer-events-none"></div>
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Pourquoi choisir<br />
              <span className="text-blue-600">Consult-Chrono</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-8 md:py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-pink-50/20 pointer-events-none"></div>
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 relative z-10">
          <Card className="p-8 md:p-10 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                    Sécurité & conformité
                  </h3>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  Vos données de santé sont traitées avec la plus grande confidentialité. Nos médecins sont légalement habilités à délivrer un arrêt maladie lorsque cela est justifié. En cas d'urgence, appelez le 15.
                </p>
                <div className="flex flex-wrap gap-6">
                  <a href="/terms" className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    <Lock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Politique de confidentialité
                  </a>
                  <a href="/terms" className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Mentions légales
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-8 md:py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/20 via-transparent to-blue-50/20 pointer-events-none"></div>
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full mb-6 shadow-lg">
              <Headphones className="h-4 w-4" />
              <span className="text-sm font-semibold">Support & FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Questions fréquentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-2xl mb-4 bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <AccordionTrigger className="text-left px-6 py-5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-2xl font-semibold text-gray-800 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-gray-600 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{faq.answer}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 md:py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-pink-50/20 pointer-events-none"></div>
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 relative z-10">
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl mb-6 mx-auto shadow-xl animate-pulse">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Répondez au questionnaire – c'est rapide et sécurisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate("/consultation")}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-2xl font-bold text-lg w-full sm:w-auto shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                  Commencer mon diagnostic
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>3 minutes en moyenne</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Section SEO - Tout savoir sur l'arrêt maladie en ligne */}
      <section id="infos-arret-maladie" className="max-w-4xl mx-auto px-4 py-12 text-slate-700 bg-white">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Tout savoir sur l'arrêt maladie en ligne
        </h2>
        <p className="leading-relaxed mb-4">
          <strong>Obtenir un arrêt maladie rapidement</strong> est désormais possible grâce à la téléconsultation. 
          Consult-Chrono vous permet de recevoir un <strong>arrêt maladie en ligne</strong> en quelques minutes, 
          sans déplacement ni rendez-vous physique. Ce service s'adresse à toute personne souffrant d'une affection 
          courante comme la grippe, une gastro-entérite, du stress, des migraines ou des symptômes liés au Covid-19.
        </p>
        <p className="leading-relaxed mb-4">
          Chaque document est <strong>légal et conforme</strong> à la réglementation française. Il est délivré par 
          un médecin agréé et peut être transmis à votre employeur ou à la sécurité sociale comme un arrêt classique. 
          Vous n'avez pas besoin d'un médecin traitant : notre formulaire sécurisé permet à nos médecins partenaires 
          de valider votre demande en toute conformité.
        </p>
        <p className="leading-relaxed mb-4">
          Le traitement de votre demande est rapide : en général, vous recevez votre <strong>arrêt maladie légal en ligne</strong> par 
          email sous 24 heures. Consult-Chrono simplifie vos démarches tout en respectant le cadre légal et médical en vigueur.
        </p>
        <div className="mt-6 space-x-4">
          <a href="#faq" className="text-[#008AA4] underline hover:text-[#006F82] transition-colors">
            Voir la FAQ
          </a>
          <a href="/terms" className="text-[#008AA4] underline hover:text-[#006F82] transition-colors">
            Conditions légales
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <img src="/logo-big-white.png" alt="Consult-Chrono" className="h-10" />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Plateforme de télémédecine certifiée pour obtenir votre arrêt maladie en ligne, 24h/24, 7j/7.
              </p>
            </div>
            
            {/* Links */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Informations</h3>
              <div className="space-y-3">
                <a href="/terms" className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Mentions légales
                </a>
                <a href="/terms" className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Lock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Politique de confidentialité
                </a>
                <a href="/a-propos" className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  À propos
                </a>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>Service client 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>France</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Shield className="h-4 w-4" />
                  <span>Certifié HDS</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} Consult-Chrono. Tous droits réservés.
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Cabinet de télémédecine</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>France</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
