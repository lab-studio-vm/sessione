/* =====================================================================
   AVATAR DEI GIOCATORI SIMULATI
   Usato sia da Cyberball (gioco-a.html, gioco-b.html) sia dal compito
   della figura (figura.html), cosi' l'avatar incontrato nel parco e'
   identico a quello che il partecipante ritrova nella voodoo doll.

   Ogni nickname ha il suo aspetto fisso: colore della maglia, dei
   pantaloni e dei capelli. Le giocatrici hanno i capelli lunghi.
   Corpo, pelle e proporzioni sono uguali per tutti (richiesta del
   relatore, incontro del 22 settembre 2026).
   ===================================================================== */
(function (root) {
  "use strict";

  var PELLE = 0xf5c8a5;

  var ASPETTO = {
    "riccardo_s":  { sesso: "m", maglia: 0xe63946, pantaloni: 0x1d3557, capelli: 0x3e2723 },
    "federica.99": { sesso: "f", maglia: 0xf4a261, pantaloni: 0x264653, capelli: 0x5d4037 },
    "giulia.94":   { sesso: "f", maglia: 0x2a9d8f, pantaloni: 0x3d405b, capelli: 0x2b1d16 },
    "matteo_b":    { sesso: "m", maglia: 0xe9c46a, pantaloni: 0x4a4e69, capelli: 0x6d4c41 },
    "andrea_p":    { sesso: "m", maglia: 0x6c757d, pantaloni: 0x22223b, capelli: 0x1c1c1c },
    "chiara.98":   { sesso: "f", maglia: 0x9d4edd, pantaloni: 0x2b2d42, capelli: 0xa67c45 },
    "sara.97":     { sesso: "f", maglia: 0x48cae4, pantaloni: 0x1d3557, capelli: 0x7b3f1e },
    "luca_m":      { sesso: "m", maglia: 0xbc4749, pantaloni: 0x2f3e46, capelli: 0x4e342e }
  };

  function aspetto(nick) {
    return ASPETTO[String(nick || "").toLowerCase()] || null;
  }

  // Costruisce l'avatar. Stessa struttura dell'omino originale del gioco
  // (userData.shoulderL / shoulderR / throwAnim), cosi' le animazioni
  // di lancio continuano a funzionare. Ogni mesh porta userData.zona,
  // usata dalla voodoo doll per sapere dove e' stato messo lo spillo.
  function costruisci(THREE, a) {
    var g = new THREE.Group();
    var L = function (c) { return new THREE.MeshLambertMaterial({ color: c }); };
    var mPelle = L(PELLE), mMaglia = L(a.maglia), mPant = L(a.pantaloni),
        mCap = L(a.capelli), mScarpe = L(0x222222);

    function box(w, h, d, mat, x, y, z, zona, parent) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.userData.zona = zona;
      (parent || g).add(m);
      return m;
    }

    // gambe e scarpe (a sinistra nell'immagine = x negativa)
    box(0.18, 0.8, 0.22, mPant, -0.13, 0.4, 0, "gamba sinistra");
    box(0.18, 0.8, 0.22, mPant,  0.13, 0.4, 0, "gamba destra");
    box(0.22, 0.1, 0.32, mScarpe, -0.13, 0.05, 0.04, "gamba sinistra");
    box(0.22, 0.1, 0.32, mScarpe,  0.13, 0.05, 0.04, "gamba destra");

    // busto
    box(0.52, 0.65, 0.28, mMaglia, 0, 1.13, 0, "torso");

    // collo e testa
    var collo = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.1, 8), mPelle);
    collo.position.y = 1.5; collo.userData.zona = "testa"; g.add(collo);
    box(0.28, 0.32, 0.28, mPelle, 0, 1.72, 0, "testa");

    // capelli
    box(0.31, 0.12, 0.31, mCap, 0, 1.865, 0, "testa");
    if (a.sesso === "f") {
      box(0.31, 0.50, 0.07, mCap, 0, 1.63, -0.15, "testa");       // dietro, fino alle spalle
      box(0.04, 0.40, 0.25, mCap, -0.155, 1.67, -0.015, "testa"); // ciocca sinistra
      box(0.04, 0.40, 0.25, mCap,  0.155, 1.67, -0.015, "testa"); // ciocca destra
      box(0.30, 0.05, 0.03, mCap, 0, 1.825, 0.145, "testa");      // frangia
    } else {
      box(0.31, 0.14, 0.05, mCap, 0, 1.79, -0.145, "testa");      // nuca
    }

    // occhi e bocca
    var nero = new THREE.MeshBasicMaterial({ color: 0x111111 });
    var occhio = new THREE.SphereGeometry(0.025, 8, 8);
    [-0.06, 0.06].forEach(function (x) {
      var o = new THREE.Mesh(occhio, nero);
      o.position.set(x, 1.74, 0.14); o.userData.zona = "testa"; g.add(o);
    });
    var bocca = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.01), nero);
    bocca.position.set(0, 1.66, 0.14); bocca.userData.zona = "testa"; g.add(bocca);

    // braccia (spalla come gruppo, per l'animazione di lancio)
    function braccio(x, zona) {
      var s = new THREE.Group();
      s.position.set(x, 1.38, 0);
      box(0.14, 0.55, 0.14, mMaglia, 0, -0.25, 0, zona, s);
      box(0.14, 0.12, 0.14, mPelle, 0, -0.58, 0, zona, s);
      g.add(s);
      return s;
    }
    g.userData.shoulderL = braccio(-0.3, "braccio sinistro");
    g.userData.shoulderR = braccio(0.3, "braccio destro");
    g.userData.throwAnim = 0;
    return g;
  }

  root.AVATAR = { ASPETTO: ASPETTO, aspetto: aspetto, costruisci: costruisci };
})(window);
