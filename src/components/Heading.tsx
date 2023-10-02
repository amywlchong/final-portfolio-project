interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading = ({
  title,
  subtitle,
  center
}: HeadingProps) => {
  return (
    <div>
      <div>
        {title}
      </div>
      <div>
        {subtitle}
      </div>
    </div>
   );
}

export default Heading;
