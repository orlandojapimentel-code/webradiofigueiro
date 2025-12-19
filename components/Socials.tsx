
import React from 'react';

const Socials: React.FC = () => {
  const socials = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://www.facebook.com//webradiofigueiro/' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/Orlando47524389' },
    { name: 'YouTube', icon: 'fab fa-youtube', url: 'https://www.youtube.com/channel/UClblcmnLHtfoLtUetuy483w' }
  ];

  return (
    <div className="flex items-center gap-3">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-indigo-600 hover:scale-110 transition-all text-slate-300 hover:text-white"
          aria-label={social.name}
        >
          <i className={social.icon}></i>
        </a>
      ))}
    </div>
  );
};

export default Socials;
