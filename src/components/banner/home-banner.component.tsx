import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeBannerComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className='mt-1'>
      <Slider {...settings}>
        <div>
          <img src="/src/assets/hotelbanner1.jpg" alt="Image 1" />
        </div>
        <div>
          <img src="/src/assets/hotelbanner2.jpg" alt="Image 2" />
        </div>
        <div>
          <img src="/src/assets/hotelbanner3.jpg" alt="Image 3" />
        </div>
      </Slider>
    </div>
  );
};

export default HomeBannerComponent;
