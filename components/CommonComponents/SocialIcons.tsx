import { Facebook, Instagram, Twitter } from "lucide-react";


const socialItems = [
  {
    id: 1,
    icon: <Facebook />,
    link: "#",
  },
  {
    id: 2,
    icon: <Twitter />,
    link: "#",
  },
  {
    id: 3,
    icon: <Instagram />,
    link: "#",
  },
];

const SocialIcons = () => {
  return (
    <ul className="flex items-center gap-4">
      {socialItems.map((item) => (
        <li key={item.id}>
          <a
            href={item.link}
            className="flex items-center justify-center transition duration-300 hover:-translate-y-0.5"
          >
            {item.icon}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SocialIcons;