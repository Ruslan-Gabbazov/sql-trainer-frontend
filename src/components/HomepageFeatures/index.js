import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Лекции",
    Svg: require("@site/static/img/lectures.svg").default,
    description: <>Лекции по предмету "Базы данных".</>,
  },
  {
    title: "Лабораторные",
    Svg: require("@site/static/img/labs.svg").default,
    description: <>Лабораторные работы по предмету "Базы данных".</>,
  },
  {
    title: "Песочница",
    Svg: require("@site/static/img/sandbox.svg").default,
    description: <>Песочница для выполнения SQL-команд в онлайн редакторе.</>,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
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
