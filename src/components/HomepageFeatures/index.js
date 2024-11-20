import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

const FeatureList = [
  {
    title: "Лекции",
    link: "/docs/lectures/%D0%9B%D0%B5%D0%BA%D1%86%D0%B8%D1%8F%201%20-%20%D0%9E%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5%20%D0%BF%D0%BE%D0%BD%D1%8F%D1%82%D0%B8%D1%8F%20%D1%82%D0%B5%D0%BE%D1%80%D0%B8%D0%B8%20%D0%B1%D0%B0%D0%B7%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85/",
    Svg: require("@site/static/img/lectures.svg").default,
    description: <>Лекции по предмету "Базы данных".</>,
  },
  {
    title: "Лабораторные",
    link: "/docs/labs/%D0%9B%D0%B0%D0%B1%D0%BE%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%201%20-%20%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%B0%D0%B7%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D0%B2%20Postgres/",
    Svg: require("@site/static/img/labs.svg").default,
    description: <>Лабораторные работы по предмету "Базы данных".</>,
  },
  {
    title: "Песочница",
    link: "/sandbox-one",
    Svg: require("@site/static/img/sandbox.svg").default,
    description: <>Песочница для выполнения SQL-команд в онлайн редакторе.</>,
  },
];

function Feature({ Svg, title, description, link }) {
  return (
    <Link to={link} className={clsx(styles.featureLink, "col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </Link>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
