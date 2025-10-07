import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  Clock,
  ShieldCheck,
  FileText,
  Stethoscope,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: ClipboardCheck,
      title: "Répondez au questionnaire",
      description:
        "Remplissez un formulaire médical simple et sécurisé en quelques minutes.",
    },
    {
      icon: Stethoscope,
      title: "Validation médicale",
      description:
        "Un médecin certifié examine votre demande et établit le diagnostic.",
    },
    {
      icon: FileText,
      title: "Recevez votre arrêt",
      description:
        "Votre arrêt maladie légal vous est envoyé par email sous 24h.",
    },
  ];

  const testimonials = [
    {
      name: "Marie D.",
      text: "Service rapide et professionnel. J'ai reçu mon arrêt en moins de 12h.",
      rating: 5,
    },
    {
      name: "Thomas L.",
      text: "Très pratique quand on ne peut pas se déplacer. Recommandé !",
      rating: 5,
    },
    {
      name: "Sophie M.",
      text: "Processus simple et sécurisé. Exactement ce dont j'avais besoin.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "L'arrêt maladie est-il reconnu par l'Assurance Maladie ?",
      answer:
        "Oui, tous nos arrêts maladie sont établis par des médecins certifiés et sont légalement reconnus par l'Assurance Maladie et votre employeur.",
    },
    {
      question: "Combien de temps prend la consultation ?",
      answer:
        "Le questionnaire prend environ 5-10 minutes. Vous recevrez votre arrêt maladie par email sous 24 heures maximum après validation médicale.",
    },
    {
      question: "Quelle est la durée maximum de l'arrêt ?",
      answer:
        "Pour une première consultation en ligne, nous pouvons établir des arrêts maladie d'une durée maximale de 7 jours.",
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer:
        "Absolument. Toutes vos données médicales sont chiffrées et traitées conformément au RGPD. Nous ne les partageons jamais avec des tiers.",
    },
    {
      question: "Puis-je prolonger mon arrêt maladie ?",
      answer:
        "Oui, si vous avez besoin d'une prolongation, vous pouvez faire une nouvelle demande via notre service.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Obtenez un arrêt maladie légal en quelques clics
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              24/7, sans quitter votre domicile. Consultation médicale en ligne
              sécurisée et conforme.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate("/consultation")}
                className="text-lg px-8"
              >
                Commencer mon diagnostic sécurisé
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/comment-ca-marche")}
              >
                Comment ça marche ?
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Conforme RGPD</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Réponse sous 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Médecins certifiés</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un processus simple en 3 étapes pour obtenir votre arrêt maladie
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="relative p-8 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des milliers de patients satisfaits
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircle key={i} className="h-5 w-5 text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Prêt à obtenir votre arrêt maladie ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Ne laissez pas la maladie perturber votre quotidien plus que
            nécessaire. Commencez votre consultation maintenant.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/consultation")}
            className="text-lg px-8"
          >
            Démarrer maintenant
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur notre service
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="max-w-3xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
