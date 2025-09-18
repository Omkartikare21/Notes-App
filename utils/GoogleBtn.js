// import { useState } from 'react';
// import styles from '@/styles/Home.module.css';

// // Google logo colors
// const COLORS = [
//   { name: 'red', css: styles.red },
//   { name: 'blue', css: styles.blue },
//   { name: 'yellow', css: styles.yellow },
//   { name: 'green', css: styles.green }
// ];

// // Edge positions to avoid the center
// const POSITIONS = [
//   { top: 0, left: 0 },
//   { top: 0, right: 0 },
//   { bottom: 0, left: 0 },
//   { bottom: 0, right: 0 },
//   // You can add more edge positions if desired
// ];

// function getRandomized(items) {
//   // Fisher-Yates shuffle
//   let arr = [...items];
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }

// export default function GoogleButton() {
//   const [shapes, setShapes] = useState(COLORS);

//   function onHover() {
//     // Shuffle colors and positions each hover
//     const shuffledColors = getRandomized(COLORS);
//     setShapes(shuffledColors);
//   }

//   return (
//     <button
//       className={styles.googleBtn}
//       onMouseEnter={onHover}
//       // Optionally: onMouseLeave={() => setShapes(COLORS)}
//     >
//       Hover me
//       <div className={styles.circles}>
//         {shapes.map((color, idx) => {
//           const pos = POSITIONS[idx];
//           return (
//             <span
//               key={color.name}
//               className={`${styles.circle} ${color.css}`}
//               style={{
//                 ...pos
//               }}
//             ></span>
//           );
//         })}
//       </div>
//     </button>
//   );
// }



// import { useState } from 'react';
// import styles from '@/styles/Home.module.css';

// // Google logo colors with CSS module classes
// const COLORS = [
//   { name: 'red', css: styles.red },
//   { name: 'blue', css: styles.blue },
//   { name: 'yellow', css: styles.yellow },
//   { name: 'green', css: styles.green }
// ];

// // Edge positions to keep circles away from center
// const POSITIONS = [
//   { top: 0, left: 0 },
//   { top: 0, right: 0 },
//   { bottom: 0, left: 0 },
//   { bottom: 0, right: 0 }
// ];

// // Helper shuffle
// function getRandomized(items) {
//   let arr = [...items];
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }

// export default function GoogleButton() {
//   // shapes state holds array of color + size + position objects
//   const [shapes, setShapes] = useState(
//     COLORS.map((color, idx) => ({
//       ...color,
//       ...POSITIONS[idx],
//       size: 20 // initial size
//     }))
//   );

//   function onHover() {
//     // Shuffle colors and positions
//     const shuffledColors = getRandomized(COLORS);
//     const shuffledPositions = getRandomized(POSITIONS);

//     // Map shuffled colors & positions + add random size (15 to 30)
//     const newShapes = shuffledColors.map((color, idx) => ({
//       ...color,
//       ...shuffledPositions[idx],
//       size: 15 + Math.floor(Math.random() * 16) // random size 15-30
//     }));

//     setShapes(newShapes);
//   }

//   return (
//     <button className={styles.googleBtn} onMouseEnter={onHover}>
//       Hover me
//       <div className={styles.circles}>
//         {shapes.map((shape) => (
//           <span
//             key={shape.name}
//             className={`${styles.circle} ${shape.css}`}
//             style={{
//               width: shape.size + 'px',
//               height: shape.size + 'px',
//               top: shape.top !== undefined ? shape.top : 'auto',
//               bottom: shape.bottom !== undefined ? shape.bottom : 'auto',
//               left: shape.left !== undefined ? shape.left : 'auto',
//               right: shape.right !== undefined ? shape.right : 'auto',
//               transform: `translate(${shape.left === 0 ? '-50%' : shape.right === 0 ? '50%' : 0}, ${
//                 shape.top === 0 ? '-50%' : shape.bottom === 0 ? '50%' : 0
//               })`,
//             }}
//           ></span>
//         ))}
//       </div>
//     </button>
//   );
// }




import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import CustomIcon from '@/components/CustomIcon';

const COLORS = [
  { name: 'red', css: styles.red },
  { name: 'blue', css: styles.blue },
  { name: 'yellow', css: styles.yellow },
  { name: 'green', css: styles.green }
];

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function generateAnimationPath(size) {
  // Generate random movement keyframe percentages and positions within button bounds (subtract circle size)
  const points = [];
  const steps = 5;

  for (let i = 0; i <= steps; i++) {
    points.push({
      percent: i * (80 / steps),
      top: getRandom(1, 100), // percentages to keep inside
      left: getRandom(1, 120)
    });
  }

  // Build keyframe string
  let keyframe = '';
  points.forEach((p) => {
    keyframe += `
      ${p.percent}% { top: ${p.top}%; left: ${p.left}%; }
    `;
  });
  return keyframe;
}

export default function GoogleButton({onClickGoogle}) {
  const [circles, setCircles] = useState([]);

  // Generate random circles with unique animation name and keyframes text inside style tag
  useEffect(() => {
    const newCircles = COLORS.map((color) => {
      const size = getRandom(15, 100);
      const animationName = `moveAnim${color.name}${Math.floor(Math.random() * 10000)}`;
      const keyframes = `
        @keyframes ${animationName} {
          ${generateAnimationPath(size)}
        }
      `;
      return { ...color, size, animationName, keyframes };
    });
    setCircles(newCircles);
  }, []);

  return (
    <>
      <style>
        {circles.map((c) => c.keyframes).join('\n')}
      </style>

      <button className={styles.googleBtn} onClick={onClickGoogle} >
        <span className={styles.text}>
            <CustomIcon />Sign In with Google</span>
        <div className={styles.circles}>
          {circles.map(({ name, css, size, animationName }) => (
            <span
              key={name}
              className={`${styles.circle} ${css}`}
              style={{
                width: size,
                height: size,
                animation: `${animationName} 6s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      </button>
    </>
  );
}
