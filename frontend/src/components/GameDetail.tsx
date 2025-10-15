import FooterNav from "./FooterNav";
import Header from "./Header";

function GameDetail() {
  return (
    <>
      <Header title="Game" />

      <div className="game-picture">
        <img
          src="https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__imagepage/img/0ksox22FKLq-Z-rsbBlF2IDG9x0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5100691.jpg"
          alt="game-picture"
        />
      </div>

      <FooterNav />
    </>
  );
}

export default GameDetail;
