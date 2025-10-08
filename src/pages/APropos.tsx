import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Shield,
  Users,
  Clock,
  Award,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Heart,
  Star,
  ArrowRight,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react";

export default function APropos() {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stats = [
    { icon: Users, number: "323", label: "Médecins partenaires" },
    { icon: FileText, number: "800 000+", label: "Documents officiels générés" },
    { icon: Clock, number: "24/7", label: "Service disponible" },
    { icon: Award, number: "100%", label: "Conforme légalement" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Aide & Accompagnement",
      description: "Nous vous aidons à naviguer dans les démarches administratives complexes pour obtenir vos documents officiels.",
    },
    {
      icon: Shield,
      title: "Légalité & Conformité",
      description: "Tous nos documents sont légalement valides et conformes aux exigences françaises et européennes.",
    },
    {
      icon: Star,
      title: "Simplicité & Efficacité",
      description: "Plus besoin de vous perdre dans les formulaires compliqués. Nous vous guidons étape par étape.",
    },
    {
      icon: Clock,
      title: "Rapidité & Disponibilité",
      description: "Service disponible 24h/24 pour vous aider à obtenir vos documents officiels rapidement.",
    },
  ];

  const benefits = [
    {
      title: "Formulaires Simplifiés",
      description: "Nous transformons les démarches administratives complexes en questions simples et claires.",
      icon: FileText,
    },
    {
      title: "Documents Officiels",
      description: "Obtenez des documents légalement valides pour votre employeur, votre RH ou vos démarches.",
      icon: Award,
    },
    {
      title: "Accompagnement Personnalisé",
      description: "Un médecin diplômé examine votre situation et vous aide à obtenir le bon document.",
      icon: Users,
    },
    {
      title: "Confidentialité Totale",
      description: "Vos informations sont protégées selon les standards les plus élevés de sécurité.",
      icon: Lock,
    },
  ];

  const certifications = [
    { name: "Légal en France", description: "Service conforme à la réglementation française" },
    { name: "Médecins Diplômés", description: "Professionnels inscrits à l'Ordre des Médecins" },
    { name: "RGPD", description: "Protection totale de vos données personnelles" },
    { name: "Hébergement HDS", description: "Sécurité maximale pour vos informations" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-6 shadow-lg">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-semibold">Notre Mission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Simplifier les démarches administratives
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Chez Consult-Rapide, nous vous aidons à naviguer dans les formulaires administratifs complexes de France. 
              Notre service vous guide étape par étape pour obtenir les documents officiels dont vous avez besoin, 
              de manière simple, rapide et entièrement légale.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Simplifier les démarches administratives complexes en France en vous accompagnant dans l'obtention 
                de documents officiels légaux. Nous transformons les formulaires compliqués en questions simples 
                pour vous faire gagner du temps et éviter les erreurs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Service légal et conforme</h3>
                    <p className="text-gray-600">Tous nos documents sont légalement valides et acceptés par les employeurs et administrations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Accompagnement personnalisé</h3>
                    <p className="text-gray-600">Un médecin diplômé examine votre situation et vous aide à obtenir le bon document.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Simplicité et rapidité</h3>
                    <p className="text-gray-600">Plus besoin de vous perdre dans les formulaires complexes. Nous vous guidons étape par étape.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Aide Administrative</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Nous comprenons que les démarches administratives peuvent être complexes. 
                    Notre équipe vous accompagne avec bienveillance pour obtenir vos documents officiels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Nos Valeurs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-4">
              Ce qui nous guide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-8 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Pourquoi Choisir Notre Service
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous vous aidons à obtenir vos documents officiels de manière simple, rapide et légale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-8 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Légalité & Conformité
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre engagement envers la légalité, la sécurité et la conformité réglementaire française.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 text-center bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl border border-white/60 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl mb-6 mx-auto shadow-xl">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Obtenez vos documents officiels
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Commencez dès maintenant votre démarche administrative simplifiée 
              et obtenez vos documents officiels en quelques étapes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate("/consultation")}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-2xl font-bold text-lg w-full sm:w-auto shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-3">
                  <FileText className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  Commencer ma démarche
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>

              <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-2 border-purple-600 text-purple-700 hover:bg-purple-50 px-6 py-6 rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      Nous contacter
                      <Mail className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold text-gray-900">
                      Contactez-nous
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-gray-600 mb-6">
                      Notre équipe est à votre disposition pour répondre à vos questions.
                    </p>
                    <Button
                      onClick={() => {
                        window.location.href = 'mailto:contact@consult-rapide.fr';
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
                    >
                      Envoyer un email
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
