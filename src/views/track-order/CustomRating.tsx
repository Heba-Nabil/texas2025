import StarRatings from "react-star-ratings";

type CustomRatingProps = {
  rating: number;
  handelChangeRating: (value: number) => Promise<void>;
};

export default function CustomRating(props: CustomRatingProps) {
  const { rating, handelChangeRating } = props;

  return (
    <StarRatings
      rating={rating}
      starRatedColor="rgb(246, 179, 24)"
      starHoverColor="rgb(246, 179, 24)"
      starEmptyColor="rgb(230 232 235)"
      changeRating={handelChangeRating}
      numberOfStars={5}
      name="rating"
      svgIconViewBox="0 0 30 30"
      svgIconPath="M15.7007 8.39068L13.462 1.0767C13.0204 -0.358899 10.9796 -0.358899 10.5532 1.0767L8.2993 8.39068H1.52231C0.0450744 8.39068 -0.564094 10.2796 0.639014 11.1259L6.18245 15.0549L4.00467 22.0213C3.56302 23.4266 5.20778 24.56 6.38042 23.6684L12 19.4372L17.6196 23.6835C18.7922 24.5751 20.437 23.4418 19.9953 22.0364L17.8176 15.07L23.361 11.141C24.5641 10.2796 23.9549 8.40579 22.4777 8.40579H15.7007V8.39068Z"
      starSpacing="7px"
      starDimension="40px"
    />
  );
}
