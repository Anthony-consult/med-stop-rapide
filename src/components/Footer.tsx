import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                M+
              </div>
              <span className="font-bold text-lg">Medicineo</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Obtenez un arrêt maladie légal en quelques clics, 24/7, sans
              quitter votre domicile.
            </p>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/comment-ca-marche"
                  className="hover:text-primary transition-colors"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/mentions-legales"
                  className="hover:text-primary transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  to="/politique-de-confidentialite"
                  className="hover:text-primary transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Medicineo. Tous droits réservés.</p>
          <p className="mt-2 text-xs">
            Ce service ne remplace pas les services d'urgence. En cas d'urgence,
            contactez le SAMU (15) ou le 112.
          </p>
        </div>
      </div>
    </footer>
  );
};
