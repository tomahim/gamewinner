import "./ImageCircle.scss";

function ImageCircle({
  player,
  absolute = false,
}: {
  player: "Thomas" | "Aurore" | "Tie";
  absolute?: boolean;
}) {
  let imageUrl =
    "https://static.vecteezy.com/ti/vecteur-libre/p1/16520155-icone-de-vecteur-desequilibre-vectoriel.jpg";

  if (player === "Aurore") {
    imageUrl =
      "https://t4.ftcdn.net/jpg/12/42/71/23/360_F_1242712312_rKSLexYtzbBcMVhVjUSP4MMxuHq6xgmu.jpg";
  }
  if (player === "Thomas") {
    imageUrl =
      "https://www.bornfree.org.uk/wp-content/uploads/2023/10/Baby-elephant-c-Diana-Robinson-Getty-Images-1292x1081.jpg";
  }

  return (
    <div className={"image-circle " + (absolute ? " absolute-top" : "")}>
      <img src={imageUrl} alt="Icon" />
    </div>
  );
}

export default ImageCircle;
