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
  const steps = 4; // controls speed as well.

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

export default function GoogleButton({onClickGoogle, type}) {
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
            <CustomIcon />Sign {type === 'New' ? 'up' : 'In'} with Google</span>
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
