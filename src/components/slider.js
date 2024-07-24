import React, { useEffect, useState } from "react";
import {
  StackedCarousel,
  ResponsiveContainer,
} from "react-stacked-center-carousel";
import Fab from "@material-ui/core/Fab";
import Cookies from "js-cookie";
import config from "../config/config";
import axios from "axios";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

export const data = [
  {
    cover: "https://images6.alphacoders.com/679/thumb-1920-679459.jpg",
    title: "Interstaller",
  },
  {
    cover: "https://images2.alphacoders.com/851/thumb-1920-85182.jpg",
    title: "Inception",
  },
  {
    cover: "https://images6.alphacoders.com/875/thumb-1920-875570.jpg",
    title: "Blade Runner 2049",
  },
  {
    cover: "https://images6.alphacoders.com/114/thumb-1920-1141749.jpg",
    title: "Icon man 3",
  },
  {
    cover: "https://images3.alphacoders.com/948/thumb-1920-948864.jpg",
    title: "Venom",
  },
  {
    cover: "https://images2.alphacoders.com/631/thumb-1920-631095.jpg",
    title: "Steins Gate",
  },
  {
    cover: "https://images4.alphacoders.com/665/thumb-1920-665242.png",
    title: "One Punch Man",
  },
  {
    cover: "https://images2.alphacoders.com/738/thumb-1920-738176.png",
    title: "A Silent Voice",
  },
  {
    cover: "https://images8.alphacoders.com/100/thumb-1920-1005531.jpg",
    title: "Demon Slayer",
  },
  {
    cover: "https://images2.alphacoders.com/582/thumb-1920-582804.png",
    title: "Attack On Titan",
  },
];


export default function Slider(props) {
  const ref = React.useRef();
  const [loginData, setloginData] = useState((!Cookies.get('lordsNFTleUserloginSuccess')) ? [] : JSON.parse(Cookies.get('lordsNFTleUserloginSuccess')))
  const [recentNfts, setrecentNfts] = useState([])
  const [recentNftsdata, setrecentNftsdata] = useState([])


  useEffect(() => {
    recentnftList()
  }, []);


  const recentnftList = async () => {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserItem`,
      data: {
        "user_id": "0",
        "login_user_id": loginData && loginData.id ? loginData.id : '0',
        "user_collection_id": "0",
        "is_featured": "0",
        "recent": "1",
        "limit": "0",
        "is_trending": '0'
      }
    }).then((res) => {
      if (res.data.success === true) {
        setrecentNfts(res.data.response.filter(item => item.collection_id != null))
        let dataArray = res.data.response.filter(item => item.collection_id != null)
        let newArr = []
        // setTimeout(() => {
        // let element = []
        for (let i = 0; i < dataArray.length; i++) {
          newArr.push({ cover: config.imageUrl + dataArray[i].image, title: dataArray[i].name });

        }
        if (newArr.length < 4) {
          newArr.push(newArr[0])
          newArr.push(newArr[1])
        }
        setrecentNftsdata(newArr)
      }

    }).catch((error) => {

    })
  }

  return (
    <div >

      {/* {console.log('recentNfts',recentNfts)} */}
      <ResponsiveContainer
        carouselRef={ref}
        render={(parentWidth, carouselRef) => {
          // If you want to use a ref to call the method of StackedCarousel, you cannot set the ref directly on the carousel component
          // This is because ResponsiveContainer will not render the carousel before its parent's width is determined
          // parentWidth is determined after your parent component mounts. Thus if you set the ref directly it will not work since the carousel is not rendered
          // Thus you need to pass your ref object to the ResponsiveContainer as the carouselRef prop and in your render function you will receive this ref object
          let currentVisibleSlide = 5;
          if (parentWidth <= 1440) currentVisibleSlide = 5;
          if (parentWidth <= 1080) currentVisibleSlide = 1;
          return (
            <>{(recentNftsdata.length > 3) &&
              <StackedCarousel
                ref={carouselRef}
                slideComponent={Card}
                slideWidth={parentWidth < 500 ? parentWidth - 100 : 500}
                carouselWidth={parentWidth}
                data={recentNftsdata}
                currentVisibleSlide={currentVisibleSlide}
                maxVisibleSlide={5}
                useGrabCursor
              />
            }</>
          );
        }}
      />
      <>
        <Fab
          style={{ position: "absolute", top: "40%", zIndex: 10 }}
          size="small"
          color="primary"
          onClick={() => {
            ref.current?.goBack();
          }}
        >
          {/* <ArrowBackIcon /> */}
        </Fab>
        <Fab
          style={{ position: "absolute", top: "40%", zIndex: 10 }}
          size="small"
          color="primary"
          onClick={() => {
            ref.current?.goNext(6);
          }}
        >
          {/* <ArrowForwardIcon /> */}
        </Fab>
      </>
    </div>
  );
}

// Very import to memoize your Slide component otherwise there might be performance issue
// At minimum your should do a simple React.memo(SlideComponent)
// If you want the absolute best performance then pass in a custom comparator function like below 
export const Card = React.memo(function (props) {
  console.log("props", props)
  const { data, dataIndex } = props;
  const { cover } = data[dataIndex];
  return (
    <div
      style={{
        width: "100%",
        height: 300,
        userSelect: "none",
      }}
      className="my-slide-component"
    >
      <img
        style={{
          height: "100%",
          width: "100%",
          objectFit: "cover",
          borderRadius: 0,
        }}
        draggable={false}
        src={cover}
      />
    </div>
  );
});