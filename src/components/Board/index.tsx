import React, { useMemo, useCallback } from 'react';
import MouseBackEnd from 'react-dnd-mouse-backend';
import { useDrag, DndProvider, useDrop } from 'react-dnd';
import { update } from 'ramda';

import Player from '../../models/Player';
import data from './points';
import './styles.css';

const POINT = 'POINT';

const Point: React.SFC<{
  id: string;
  position: any;
  cx: number;
  cy: number;
}> = React.memo((props) => {
  const { id } = props;
  const [collectedProps, drag] = useDrag({
    item: { id, type: POINT, payload: props.position },
    collect: monitor => {
      if (!monitor.isDragging()) {
        return
      }
      return monitor.getDifferenceFromInitialOffset();
    },
  });
  const x = collectedProps ? collectedProps.x + props.cx : props.cx;
  const y = collectedProps ? collectedProps.y + props.cy : props.cy;
  return (
    <circle
      className={`point ${collectedProps && 'point-invisible'}`}
      fill={props.position.color}
      r={13.12}
      ref={drag}
      cx={x}
      cy={y}
    />
  );
});

const Drop: React.SFC<{
  polygon: any;
  onDrop?: (pointDescription, target: number) => any;
}> = React.memo(({polygon, onDrop}) => {

  const [, drop] = useDrop({
    accept: POINT,
    drop: useCallback((pointDescription) =>
      onDrop && onDrop(pointDescription, polygon.position)
    , [onDrop, polygon.position])
  });

  return (
    <g className="polygon-container">
      <circle
        className={`slot`}
        cx={polygon.cx}
        cy={polygon.cy}
        r="13.12"
      />
      <circle
        ref={drop}
        className={`slot-hover`}
        cx={polygon.cx}
        cy={polygon.cy}
        r="20"
      />
    </g>
  );
});

const margins = {
  left: 10,
  top: 10,
  right: 10,
  bottom: 10,
};

type Pawn = {
  position: number,
  color: string
};

type Props = {
  players?: Player[];
  pawns: {
    position: number,
    color: string
  }[];
  setPawns: (pawns: any) => any;
};

const Board: React.SFC<Props> = props => {
  const { pawns, setPawns } = props;
  const width = 1000;
  const height = 1000;
  const onDrop = useCallback((pointDescription, newPosition) => {
    setPawns(
      update<any>(
        pawns.indexOf(pointDescription.payload),
        {...pointDescription.payload, position: newPosition},
        pawns
      ),
    );
  }, [pawns, setPawns]);

  return (
    <svg
      width={width + margins.left + margins.right}
      height={height + margins.top + margins.bottom}
      version="1.1"
      x="0px"
      y="0px"
      viewBox={`0 0 1000 1000`}
    >
      <g>
        <g>
          {useMemo(() =>
            data.map((polygon, index) =>
              <Drop onDrop={onDrop} key={index} polygon={polygon} />
            )
          , [onDrop])}
        </g>
        <g className="points">
          {pawns.map((pawn, i) => {
            const position = data[pawn.position];
            const key = `${pawn.color}-${i}`;
            return (
              <Point id={key} key={key} cx={position.cx} cy={position.cy} position={pawn} />
            );
          })}
        </g>
        <g id="Calque_7">
          <g id="Calque_11_-_copie">
            <circle className="st0" cx="818.72" cy="348.1" r="13.12"/>
            <circle className="st0" cx="847.52" cy="319.3" r="13.12"/>
            <circle className="st0" cx="877.25" cy="289.57" r="13.12"/>
            <circle className="st0" cx="876.79" cy="249.15" r="13.12"/>
          </g>
        </g>
        <g id="Calque_3">
          <g id="Calque_11_-_copie_4">
            <circle className="st1" cx="822.27" cy="647.86" r="13.12"/>
            <circle className="st1" cx="851.07" cy="676.66" r="13.12"/>
            <circle className="st1" cx="880.8" cy="706.39" r="13.12"/>
            <circle className="st1" cx="921.22" cy="705.92" r="13.12"/>
          </g>
        </g>
        <g id="Calque_4">
          <g id="Calque_11">
            <circle className="st2" cx="502.99" cy="712.17" r="13.12"/>
            <circle className="st2" cx="502.99" cy="752.9" r="13.12"/>
            <circle className="st2" cx="502.99" cy="794.95" r="13.12"/>
            <circle className="st2" cx="531.89" cy="823.2" r="13.12"/>
          </g>
        </g>
        <g id="Calque_8">
          <g id="Calque_20">
            <circle className="st3" cx="186.86" cy="652.36" r="13.12"/>
            <circle className="st3" cx="158.06" cy="681.16" r="13.12"/>
            <circle className="st3" cx="128.33" cy="710.89" r="13.12"/>
            <circle className="st3" cx="128.79" cy="751.31" r="13.12"/>
          </g>
        </g>
        <g id="Calque_6">
          <g id="Calque_11_-_copie_2">
            <circle className="st4" cx="179.64" cy="351.82" r="13.12"/>
            <circle className="st4" cx="150.84" cy="323.02" r="13.12"/>
            <circle className="st4" cx="121.11" cy="293.29" r="13.12"/>
            <circle className="st4" cx="80.69" cy="293.75" r="13.12"/>
          </g>
        </g>
        <g id="Calque_5">
          <g id="Calque_11_-_copie_3">
            <circle className="st5" cx="503.53" cy="288.24" r="13.12"/>
            <circle className="st5" cx="503.53" cy="247.51" r="13.12"/>
            <circle className="st5" cx="503.53" cy="205.46" r="13.12"/>
            <circle className="st5" cx="474.62" cy="177.21" r="13.12"/>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default React.memo((props: Props) => <DndProvider backend={MouseBackEnd}><Board {...props} /></DndProvider>);
