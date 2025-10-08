import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardNav from '@/components/CardNav';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clear consultation ID from localStorage
    localStorage.removeItem('consultation_id');
  }, []);

  const navItems = [
    {
      label: "Accueil",
      bgColor: "linear-gradient(135deg, #0A6ABF 0%, #3B82F6 100%)",
      textColor: "#fff",
      links: [
        { label: "Accueil", ariaLabel: "Page d'accueil", onClick: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
        { label: "Comment ça marche", ariaLabel: "Comment ça marche", onClick: () => { navigate('/'); setTimeout(() => { document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' }); }, 100); } }
      ]
    },
    {
      label: "Obtenir mon arrêt", 
      bgColor: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
      textColor: "#fff",
      links: [
        { label: "Consultation", ariaLabel: "Consultation médicale", onClick: () => navigate('/consultation') },
        { label: "Certificats", ariaLabel: "Certificats médicaux", onClick: () => navigate('/consultation') }
      ]
    },
    {
      label: "À propos",
      bgColor: "linear-gradient(135deg, #059669 0%, #10B981 100%)", 
      textColor: "#fff",
      links: [
        { label: "Notre mission", ariaLabel: "Notre mission", onClick: () => navigate('/a-propos') },
        { label: "Nos valeurs", ariaLabel: "Nos valeurs", onClick: () => navigate('/a-propos') }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <CardNav 
        logo="/logo-big.png"
        logoAlt="Consult-Chrono"
        items={navItems}
      />

      <div className="pt-32 md:pt-40 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Paiement confirmé !
          </h1>

          <p className="text-lg text-center text-gray-600 mb-8">
            Votre demande d'arrêt maladie a été enregistrée avec succès.
          </p>

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Email de confirmation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Un email de confirmation a été envoyé à votre adresse. Vérifiez également vos spams.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Traitement de votre dossier
                  </h3>
                  <p className="text-sm text-gray-600">
                    Un médecin partenaire examinera votre demande dans les plus brefs délais. Vous recevrez votre arrêt maladie par email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              📋 Prochaines étapes
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Vous recevrez votre certificat médical par email sous 24h ouvrées maximum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Transmettez-le à votre employeur et à votre caisse d'assurance maladie</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Conservez une copie pour vos dossiers personnels</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-base"
            >
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Une question ? Contactez-nous à{' '}
              <a 
                href="mailto:contact@consult-chrono.fr" 
                className="text-blue-600 hover:underline"
              >
                contact@consult-chrono.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
