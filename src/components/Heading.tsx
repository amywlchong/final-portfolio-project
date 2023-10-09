interface HeadingProps {
  title: string;
  subtitle?: string;
}

const Heading = ({
  title,
  subtitle
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
