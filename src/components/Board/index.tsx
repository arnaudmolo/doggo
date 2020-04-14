import React from 'react';
import range from 'ramda/src/range';
import Player from '../../models/Player';
import './styles.css';

type Props = {
  players: Player[];
};

const PLACE_PER_LINE = 4;
const LINE_PER_PLAYER = 4;
const COLORS = ['white', 'blue', 'red', 'black', 'yellow', 'green'];
const translate = (y: number, x: number) => `translate(${y}, ${x})`

const nodeIndex = (element) => Array.from(element.parentNode.children).indexOf(element);

const Board: React.SFC<Props> = props => {
  const track = range(0, (props.players.length * LINE_PER_PLAYER * PLACE_PER_LINE));
  const width = 500;
  const height = 500;
  const margins = {
    left: 10,
    top: 10,
    right: 10,
    bottom: 10,
  }
  return (
    <div>
      <svg
        width={width + margins.left + margins.right}
        height={height + margins.top + margins.bottom}
        version="1.1"
        x="0px"
        y="0px"
        viewBox={`0 0 1000 1000`}
        onClickCapture={(event) => {
          const element = (event.target as SVGElement);
          const indexInParent = 15 - nodeIndex(element);
          const indexOfGroup = 6 - nodeIndex(element.parentNode);
          console.log({indexInParent, indexOfGroup});
        }}
      >
        <g>
          <g id="Calque_7">
            <circle className="st0" cx="461.2" cy="125.31" r="13.14"/>
            <circle className="st0" cx="502.59" cy="125.31" r="13.14"/>
            <circle className="st0" cx="544.63" cy="125.31" r="13.14"/>
            <circle className="st0" cx="585.36" cy="125.31" r="13.14"/>
            <circle className="st0" cx="585.36" cy="167.35" r="13.14"/>
            <circle className="st0" cx="585.36" cy="206.77" r="13.14"/>
            <circle className="st0" cx="585.36" cy="248.82" r="13.14"/>
            <circle className="st0" cx="585.36" cy="290.86" r="13.14"/>
            <circle className="st0" cx="625.96" cy="289" r="13.14"/>
            <circle className="st0" cx="665.48" cy="289" r="13.14"/>
            <circle className="st0" cx="707.8" cy="292.45" r="13.14"/>
            <circle className="st0" cx="748.23" cy="305.59" r="13.14"/>
            <circle className="st0" cx="777.96" cy="275.86" r="13.14"/>
            <circle className="st0" cx="807.69" cy="246.13" r="13.14"/>
            <circle className="st0" cx="835.56" cy="218.25" r="13.14"/>
            <circle className="st0" cx="865.3" cy="188.52" r="13.14"/>
            <g className="board--points-container">
              <circle className="board-point st0" cx="793.3" cy="186.59" r="13.14"/>
              <circle className="board-point st0" cx="752.57" cy="186.59" r="13.14"/>
              <circle className="board-point st0" cx="710.52" cy="186.59" r="13.14"/>
              <circle className="board-point st0" cx="669.13" cy="186.59" r="13.14"/>
            </g>
            <g id="Calque_11_-_copie">
              <circle className="st0" cx="818.72" cy="348.1" r="13.14"/>
              <circle className="st0" cx="847.52" cy="319.3" r="13.14"/>
              <circle className="st0" cx="877.25" cy="289.57" r="13.14"/>
              <circle className="st0" cx="876.79" cy="249.15" r="13.14"/>
            </g>
          </g>
          <g id="Calque_3">
            <circle className="st1" cx="897.97" cy="211.01" r="13.14"/>
            <circle className="st1" cx="930.34" cy="238.06" r="13.14"/>
            <circle className="st1" cx="958.24" cy="265.91" r="13.14"/>
            <circle className="st1" cx="982.79" cy="300.91" r="13.14"/>
            <circle className="st1" cx="953.56" cy="328.38" r="13.14"/>
            <circle className="st1" cx="923.36" cy="359.43" r="13.14"/>
            <circle className="st1" cx="893.17" cy="390.47" r="13.14"/>
            <circle className="st1" cx="865.38" cy="419.71" r="13.14"/>
            <circle className="st1" cx="878.52" cy="457.25" r="13.14"/>
            <circle className="st1" cx="879.66" cy="499.35" r="13.14"/>
            <circle className="st1" cx="878.52" cy="539.39" r="13.14"/>
            <circle className="st1" cx="866.52" cy="579.29" r="13.14"/>
            <circle className="st1" cx="896.51" cy="608.77" r="13.14"/>
            <circle className="st1" cx="926.49" cy="638.25" r="13.14"/>
            <circle className="st1" cx="954.6" cy="665.88" r="13.14"/>
            <circle className="st1" cx="984.58" cy="695.36" r="13.14"/>
            <g className="board--points-container">
              <circle className="board-point st1" cx="983.78" cy="622.43" r="13.14"/>
              <circle className="board-point st1" cx="983.78" cy="581.7" r="13.14"/>
              <circle className="board-point st1" cx="983.78" cy="539.66" r="13.14"/>
              <circle className="board-point st1" cx="983.78" cy="498.27" r="13.14"/>
            </g>
            <g id="Calque_11_-_copie_4">
              <circle className="st1" cx="822.27" cy="647.86" r="13.14"/>
              <circle className="st1" cx="851.07" cy="676.66" r="13.14"/>
              <circle className="st1" cx="880.8" cy="706.39" r="13.14"/>
              <circle className="st1" cx="921.22" cy="705.92" r="13.14"/>
            </g>
          </g>
          <g id="Calque_4">
            <circle className="st2" cx="959.89" cy="727.61" r="13.14"/>
            <circle className="st2" cx="932.56" cy="759.74" r="13.14"/>
            <circle className="st2" cx="904.47" cy="787.39" r="13.14"/>
            <circle className="st2" cx="869.25" cy="811.63" r="13.14"/>
            <circle className="st2" cx="840.3" cy="780.27" r="13.14"/>
            <circle className="st2" cx="808.39" cy="750.99" r="13.14"/>
            <circle className="st2" cx="776.48" cy="721.71" r="13.14"/>
            <circle className="st2" cx="748.7" cy="695.06" r="13.14"/>
            <circle className="st2" cx="709.28" cy="705.57" r="13.14"/>
            <circle className="st2" cx="669.86" cy="710.82" r="13.14"/>
            <circle className="st2" cx="627.81" cy="710.82" r="13.14"/>
            <circle className="st2" cx="585.77" cy="710.82" r="13.14"/>
            <circle className="st2" cx="585.77" cy="752.87" r="13.14"/>
            <circle className="st2" cx="585.77" cy="794.92" r="13.14"/>
            <circle className="st2" cx="585.77" cy="834.34" r="13.14"/>
            <circle className="st2" cx="585.77" cy="876.38" r="13.14"/>
            <g id="Calque_10">
              <circle className="st2" cx="440.5" cy="913.89" r="13.14"/>
              <circle className="st2" cx="481.23" cy="913.89" r="13.14"/>
              <circle className="st2" cx="523.28" cy="913.89" r="13.14"/>
              <circle className="st2" cx="564.67" cy="913.89" r="13.14"/>
            </g>
            <g id="Calque_11">
              <circle className="st2" cx="502.99" cy="712.17" r="13.14"/>
              <circle className="st2" cx="502.99" cy="752.9" r="13.14"/>
              <circle className="st2" cx="502.99" cy="794.95" r="13.14"/>
              <circle className="st2" cx="531.89" cy="823.2" r="13.14"/>
            </g>
          </g>
          <g id="Calque_8">
            <circle className="st3" cx="544.38" cy="876.38" r="13.14"/>
            <circle className="st3" cx="502.99" cy="876.38" r="13.14"/>
            <circle className="st3" cx="460.94" cy="876.38" r="13.14"/>
            <circle className="st3" cx="420.21" cy="876.38" r="13.14"/>
            <circle className="st3" cx="420.21" cy="834.34" r="13.14"/>
            <circle className="st3" cx="420.21" cy="794.92" r="13.14"/>
            <circle className="st3" cx="420.21" cy="752.87" r="13.14"/>
            <circle className="st3" cx="420.21" cy="710.82" r="13.14"/>
            <circle className="st3" cx="376.99" cy="712.69" r="13.14"/>
            <circle className="st3" cx="337.46" cy="712.69" r="13.14"/>
            <circle className="st3" cx="295.14" cy="709.24" r="13.14"/>
            <circle className="st3" cx="254.72" cy="696.1" r="13.14"/>
            <circle className="st3" cx="224.99" cy="725.83" r="13.14"/>
            <circle className="st3" cx="195.25" cy="755.56" r="13.14"/>
            <circle className="st3" cx="167.38" cy="783.44" r="13.14"/>
            <circle className="st3" cx="137.65" cy="813.17" r="13.14"/>
            <g className="board--points-container">
              <circle className="board-point st3" cx="213.54" cy="812.33" r="13.14"/>
              <circle className="board-point st3" cx="254.27" cy="812.33" r="13.14"/>
              <circle className="board-point st3" cx="296.32" cy="812.33" r="13.14"/>
              <circle className="board-point st3" cx="337.71" cy="812.33" r="13.14"/>
            </g>
            <g id="Calque_20">
              <circle className="st3" cx="186.86" cy="652.36" r="13.14"/>
              <circle className="st3" cx="158.06" cy="681.16" r="13.14"/>
              <circle className="st3" cx="128.33" cy="710.89" r="13.14"/>
              <circle className="st3" cx="128.79" cy="751.31" r="13.14"/>
            </g>
          </g>
          <g id="Calque_6">
            <circle className="st4" cx="102.03" cy="786.56" r="13.14"/>
            <circle className="st4" cx="69.66" cy="759.51" r="13.14"/>
            <circle className="st4" cx="41.76" cy="731.66" r="13.14"/>
            <circle className="st4" cx="17.21" cy="696.66" r="13.14"/>
            <circle className="st4" cx="46.44" cy="669.19" r="13.14"/>
            <circle className="st4" cx="76.64" cy="638.14" r="13.14"/>
            <circle className="st4" cx="106.83" cy="607.09" r="13.14"/>
            <circle className="st4" cx="134.62" cy="577.86" r="13.14"/>
            <circle className="st4" cx="121.48" cy="540.32" r="13.14"/>
            <circle className="st4" cx="120.34" cy="498.22" r="13.14"/>
            <circle className="st4" cx="121.48" cy="458.18" r="13.14"/>
            <circle className="st4" cx="133.48" cy="418.27" r="13.14"/>
            <circle className="st4" cx="103.49" cy="388.8" r="13.14"/>
            <circle className="st4" cx="73.51" cy="359.32" r="13.14"/>
            <circle className="st4" cx="45.4" cy="331.69" r="13.14"/>
            <circle className="st4" cx="15.42" cy="302.21" r="13.14"/>
            <g className="board--points-container">
              <circle className="board-point st4" cx="18.13" cy="377.24" r="13.14"/>
              <circle className="board-point st4" cx="18.13" cy="417.97" r="13.14"/>
              <circle className="board-point st4" cx="18.13" cy="460.02" r="13.14"/>
              <circle className="board-point st4" cx="18.13" cy="501.41" r="13.14"/>
            </g>
            <g id="Calque_11_-_copie_2">
              <circle className="st4" cx="179.64" cy="351.82" r="13.14"/>
              <circle className="st4" cx="150.84" cy="323.02" r="13.14"/>
              <circle className="st4" cx="121.11" cy="293.29" r="13.14"/>
              <circle className="st4" cx="80.69" cy="293.75" r="13.14"/>
            </g>
          </g>
          <g id="Calque_5">
            <circle className="st5" cx="43.48" cy="272.03" r="13.14"/>
            <circle className="st5" cx="70.82" cy="239.9" r="13.14"/>
            <circle className="st5" cx="98.91" cy="212.25" r="13.14"/>
            <circle className="st5" cx="134.13" cy="188.01" r="13.14"/>
            <circle className="st5" cx="163.08" cy="219.37" r="13.14"/>
            <circle className="st5" cx="194.99" cy="248.65" r="13.14"/>
            <circle className="st5" cx="226.89" cy="277.93" r="13.14"/>
            <circle className="st5" cx="254.68" cy="304.58" r="13.14"/>
            <circle className="st5" cx="294.1" cy="294.07" r="13.14"/>
            <circle className="st5" cx="333.52" cy="288.82" r="13.14"/>
            <circle className="st5" cx="375.56" cy="288.82" r="13.14"/>
            <circle className="st5" cx="417.61" cy="288.82" r="13.14"/>
            <circle className="st5" cx="417.61" cy="246.77" r="13.14"/>
            <circle className="st5" cx="417.61" cy="204.72" r="13.14"/>
            <circle className="st5" cx="417.61" cy="165.3" r="13.14"/>
            <circle className="st5" cx="417.61" cy="125.89" r="13.14"/>
            <g className="board--points-container">
              <circle className="board-point st5" cx="565.6" cy="86.11" r="13.14"/>
              <circle className="board-point st5" cx="524.87" cy="86.11" r="13.14"/>
              <circle className="board-point st5" cx="482.82" cy="86.11" r="13.14"/>
              <circle className="board-point st5" cx="441.43" cy="86.11" r="13.14"/>
            </g>
            <g id="Calque_11_-_copie_3">
              <circle className="st5" cx="503.53" cy="288.24" r="13.14"/>
              <circle className="st5" cx="503.53" cy="247.51" r="13.14"/>
              <circle className="st5" cx="503.53" cy="205.46" r="13.14"/>
              <circle className="st5" cx="474.62" cy="177.21" r="13.14"/>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default React.memo(Board);
