import React from "react";

const Footer = () => {
  return (
    <footer className="bg-secondary stick mb-0 p-1 text-sm ">
      <div className="container mx-auto text-center">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} Jairo de Lima. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
