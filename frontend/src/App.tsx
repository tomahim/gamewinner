import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.config";
import Login from "./components/Login";
import FirestoreData from "./components/FirestoreData";
import "./App.scss";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      {user ? (
        <div className="app">
          <header>
            <div className="menu-icon material-icons">menu</div>
            <h1>Game Winner </h1>
            <div className="filter-icon material-icons">filter_alt</div>
          </header>

          <div className="tabs">
            <div className="tab active">Games</div>
            <div className="tab">Stats</div>
            <div className="tab">History</div>
          </div>

          <section className="section-title">Games (2)</section>
          <FirestoreData />
          <div className="game-grid">
            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg"
                alt="Wingspan"
              />
              <div className="rank-tag">#38</div>
              <div className="game-name">Wingspan</div>
            </div>

            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__imagepage/img/0ksox22FKLq-Z-rsbBlF2IDG9x0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5100691.jpg"
                alt="Cascadia"
              />
              <div className="rank-tag">#54</div>
              <div className="game-name">Cascadia</div>
            </div>
          </div>

          <div className="game-grid">
            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg"
                alt="Wingspan"
              />
              <div className="rank-tag">#38</div>
              <div className="game-name">Wingspan</div>
            </div>

            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__imagepage/img/0ksox22FKLq-Z-rsbBlF2IDG9x0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5100691.jpg"
                alt="Cascadia"
              />
              <div className="rank-tag">#54</div>
              <div className="game-name">Cascadia</div>
            </div>
          </div>
          <div className="game-grid">
            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg"
                alt="Wingspan"
              />
              <div className="rank-tag">#38</div>
              <div className="game-name">Wingspan</div>
            </div>

            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__imagepage/img/0ksox22FKLq-Z-rsbBlF2IDG9x0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5100691.jpg"
                alt="Cascadia"
              />
              <div className="rank-tag">#54</div>
              <div className="game-name">Cascadia</div>
            </div>
          </div>
          <div className="game-grid">
            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg"
                alt="Wingspan"
              />
              <div className="rank-tag">#38</div>
              <div className="game-name">Wingspan</div>
            </div>

            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__imagepage/img/0ksox22FKLq-Z-rsbBlF2IDG9x0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5100691.jpg"
                alt="Cascadia"
              />
              <div className="rank-tag">#54</div>
              <div className="game-name">Cascadia</div>
            </div>
          </div>
          <div className="game-grid">
            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg"
                alt="Wingspan"
              />
              <div className="rank-tag">#38</div>
              <div className="game-name">Wingspan</div>
            </div>

            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__imagepage/img/0ksox22FKLq-Z-rsbBlF2IDG9x0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5100691.jpg"
                alt="Cascadia"
              />
              <div className="rank-tag">#54</div>
              <div className="game-name">Cascadia</div>
            </div>
          </div>
          <div className="game-grid">
            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg"
                alt="Wingspan"
              />
              <div className="rank-tag">#38</div>
              <div className="game-name">Wingspan</div>
            </div>

            <div className="game-card">
              <img
                src="https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__imagepage/img/0ksox22FKLq-Z-rsbBlF2IDG9x0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5100691.jpg"
                alt="Cascadia"
              />
              <div className="rank-tag">#54</div>
              <div className="game-name">Cascadia</div>
            </div>
          </div>

          <div className="bottom-nav">
            <div className="nav-item active material-icons">grid_view</div>
            <div className="nav-item material-icons">play_arrow</div>
            <div className="nav-item material-icons">people</div>
            <div className="nav-item material-icons">whatshot</div>
          </div>

          <div className="fab material-icons">add</div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
