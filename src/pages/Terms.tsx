import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardNav from "@/components/CardNav";
import { Mail, Shield, CreditCard, Clock, AlertCircle, CheckCircle } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="min-h-screen bg-white">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-gray-50/30 via-white to-blue-50/30 pt-32 md:pt-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              et de Confidentialité — consult-chrono.fr
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Dernière mise à jour : octobre 2025
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed">
                Bienvenue sur consult-chrono.fr, un service en ligne édité par une équipe indépendante.
                Notre objectif est de simplifier les démarches administratives liées aux arrêts maladie de courte durée, 
                en vous accompagnant dans la génération d'un document légal conforme, sans consultation médicale.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Objet du service
              </h2>
              <div className="ml-10 space-y-4">
                <p className="text-gray-700 leading-relaxed">Le site consult-chrono.fr permet à l'utilisateur :</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>de remplir un formulaire en ligne pour une demande d'arrêt maladie courte ;</li>
                  <li>de recevoir un document administratif automatisé selon les informations fournies ;</li>
                  <li>de bénéficier d'une procédure rapide et sécurisée.</li>
                </ul>
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-orange-800 text-sm">
                      <strong>Important :</strong> Ce service n'est pas un service médical et ne remplace pas une consultation auprès d'un professionnel de santé. 
                      Aucun avis médical, diagnostic ou prescription ne sont délivrés par le site.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Prix et remboursement
              </h2>
              <div className="ml-10 space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Tarif unique : 14,00 € TTC</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">Ce paiement couvre :</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>la mise à disposition du formulaire et du système de génération automatique du document ;</li>
                  <li>le traitement et l'envoi du document administratif correspondant à votre demande.</li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-800 text-sm">
                      En cas de non-éligibilité à la délivrance du document, le paiement est intégralement remboursé sur le moyen de paiement initial.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Conditions d'utilisation
              </h2>
              <div className="ml-10 space-y-4">
                <p className="text-gray-700 leading-relaxed">En utilisant ce site :</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Vous certifiez fournir des informations exactes et complètes.</li>
                  <li>Vous comprenez que le document généré est administratif et non médical.</li>
                  <li>Vous acceptez que le service puisse refuser ou annuler une demande en cas d'erreur manifeste ou de non-éligibilité.</li>
                </ul>
                <div className="mt-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <p className="text-red-800 text-sm">
                    <strong>Restriction :</strong> L'accès au site est réservé à un usage personnel. 
                    Toute tentative de copie, d'extraction de données ou d'usage frauduleux du service est interdite.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                Données personnelles et RGPD
              </h2>
              <div className="ml-10 space-y-6">
                
                {/* 4.1 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    4.1 Collecte et finalité
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p>Les informations saisies dans le formulaire (nom, date de naissance, motifs, etc.) sont collectées uniquement :</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>pour permettre la génération du document demandé,</li>
                      <li>et pour assurer un suivi client ou un remboursement le cas échéant.</li>
                    </ul>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800 text-sm">
                        <strong>Engagement :</strong> Aucune donnée n'est utilisée à des fins commerciales ou transmises à des tiers non autorisés.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4.2 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    4.2 Hébergement et sécurité
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p>Les données sont hébergées sur <strong>Supabase (AWS - région eu-west-3, Europe)</strong>.</p>
                    <p>Elles sont protégées par des mesures de sécurité conformes aux standards <strong>SSL 256-bit</strong> et aux exigences du <strong>Règlement Général sur la Protection des Données (RGPD)</strong>.</p>
                  </div>
                </div>

                {/* 4.3 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    4.3 Durée de conservation
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p>Les données sont conservées pour une durée maximale de <strong>30 jours</strong>, puis supprimées automatiquement, sauf demande contraire de l'utilisateur (ex. remboursement ou litige).</p>
                  </div>
                </div>

                {/* 4.4 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    4.4 Droit d'accès, de modification et de suppression
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p>Vous pouvez à tout moment :</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>demander la consultation, la correction ou la suppression de vos données,</li>
                      <li>exercer vos droits RGPD en écrivant à :</li>
                    </ul>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <a href="mailto:contact@consult-chrono.fr" className="text-blue-700 hover:text-blue-900 font-semibold">
                          contact@consult-chrono.fr
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                Paiement sécurisé
              </h2>
              <div className="ml-10 space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-green-800 font-semibold">Sécurité garantie</p>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Les paiements sont traités via <strong>Stripe</strong>, prestataire de paiement certifié PCI DSS</li>
                        <li>• Aucune donnée bancaire n'est stockée sur nos serveurs</li>
                        <li>• Toutes les transactions sont cryptées et sécurisées</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                Limitation de responsabilité
              </h2>
              <div className="ml-10 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Le site consult-chrono.fr agit en tant que service administratif automatisé.
                  Nous ne pouvons être tenus responsables :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>des erreurs résultant d'informations inexactes fournies par l'utilisateur ;</li>
                  <li>d'un refus d'acceptation du document par une entité extérieure (employeur, assurance, etc.) ;</li>
                  <li>de tout usage non conforme du document généré.</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
                Contact et support
              </h2>
              <div className="ml-10 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-semibold mb-2">Pour toute question, demande d'assistance ou réclamation :</p>
                      <a href="mailto:contact@consult-chrono.fr" className="text-blue-700 hover:text-blue-900 font-semibold">
                        📧 contact@consult-chrono.fr
                      </a>
                      <p className="text-blue-600 text-sm mt-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Nous nous engageons à répondre sous 24 heures ouvrées.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
                Modification des conditions
              </h2>
              <div className="ml-10 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Les présentes conditions peuvent être mises à jour à tout moment.
                  La version en vigueur est toujours accessible à l'adresse :
                </p>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <a href="https://www.consult-chrono.fr/terms" className="text-blue-600 hover:text-blue-800 font-semibold">
                    👉 https://www.consult-chrono.fr/terms
                  </a>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Résumé de nos engagements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <span>Paiement 100 % sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Données protégées (RGPD, serveurs en Europe)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Remboursement garanti si non éligible</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span>Aucun acte médical, aucune consultation</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>Assistance disponible par e-mail</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
