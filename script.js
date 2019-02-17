const STAGE_WIDTH = 12;
const STAGE_HEIGHT = 6;
const CELL_SIZE = 85;

let scene = [
  {
    type: 'pac',
    gender: 'boy',
    dir: 'right',
    color: 'light',
    name: 'martin',
    mouth: 'open',
    phase: 'active',
    apples: 0,
    pos: {
      x: 0,
      y: 0
    },
    size: {
      w: 1,
      h: 1,
    },
  },
  {
    type: 'pac',
    gender: 'girl',
    dir: 'left',
    color: 'light',
    name: 'anička',
    mouth: 'open',
    phase: 'asleep',
    apples: 0,
    pos: {
      x: 4,
      y: 4
    },
    size: {
      w: 1,
      h: 1,
    },
  },
  { type: 'wall', phase: 'active', pos: {x: 1, y: 1}, size: {w: 4, h: 1}},
  { type: 'wall', phase: 'active', pos: {x: 5, y: 1}, size: {w: 1, h: 5}},
  { type: 'bomb', phase: 'active', pos: {x: 8, y: 1}, size: {w: 1, h: 1}},
  { type: 'apple', phase: 'active', pos: {x: 7, y: 3}, size: {w: 1, h: 1}},
  { type: 'apple', phase: 'active', pos: {x: 6, y: 5}, size: {w: 1, h: 1}},
  { type: 'apple', phase: 'active', pos: {x: 11, y: 5}, size: {w: 1, h: 1}},
  { type: 'apple', phase: 'active', pos: {x: 9, y: 1}, size: {w: 1, h: 1}},
  { type: 'robot', phase: 'active', pos: {x: 7, y: 4}, size: {w: 1, h: 1}},
  { type: 'robot', phase: 'active', pos: {x: 4, y: 0}, size: {w: 1, h: 1}},
];

window.setInterval(() => {
  for(let item of scene) {
    if(item.type === 'robot') {
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      let index = Math.round(Math.random()*3);
      let newPos = {
        x: item.pos.x + dirs[index][0],
        y: item.ypos + dirs[index][1],
      };

      for(let i = 0; i < 12; i++) {
        if(collision(newPos)) {
          index = Math.round(Math.random()*3);
          newPos.x = item.pos.x + dirs[index][0];
          newPos.y = item.pos.y + dirs[index][1];
        } else {
          item.pos = newPos;
          itemUpdate(item);
          break;
        }
      }
    }
  }
}, 1000);

const contains = (point, item) => {
  if(point.x < item.pos.x) {
    return false;
  } else if(point.y < item.pos.y) {
    return false;
  } else if(point.x >= item.pos.x + item.size.w) {
    return false;
  } else if(point.y >= item.pos.y + item.size.h) {
    return false;
  }

  return true;
};

let awakePac = scene[0];

const itemRender = (item) => {
  let stage = document.querySelector('#stage');
  item.element = document.createElement('div');
  
  if(item.type === 'pac') {
    item.element.className = 'pac';
    item.element.style.width = CELL_SIZE + 'px';
    item.element.style.height = CELL_SIZE + 'px';
    item.element.addEventListener('click', () => {
      if(awakePac.phase === 'active') {
        awakePac.phase = 'asleep';
        itemUpdate(awakePac);
      }
      if(item.phase === 'asleep') {
        awakePac = item;
        awakePac.phase = 'active';
        itemUpdate(awakePac);
      }
    });
  } else {
    item.element.className = 'item';
    item.element.style.width = item.size.w * CELL_SIZE + 'px';
    item.element.style.height = item.size.h * CELL_SIZE + 'px';
  }

  itemUpdate(item);
  stage.appendChild(item.element);
}

const itemUpdate = (item) => {
  if(item.type === 'pac') {
    item.element.textContent = item.name + ': ' + item.apples;
    if(item.phase === 'dead') {
      item.element.style.backgroundImage = 'url(img/tomb.png)';
    } else {
      item.element.style.backgroundImage = (
        'url(img/pac' + 
        item.gender + '-' + 
        item.phase + '-' + 
        item.color + '.png)'
      );
    }
  
    item.element.style.left = item.pos.x * CELL_SIZE + 'px';
    item.element.style.top = item.pos.y * CELL_SIZE + 'px';  

    if(item.mouth === 'open') {
      item.element.style.backgroundPositionX = '0px';
    } else {
      item.element.style.backgroundPositionX = CELL_SIZE + 'px';
    }
  
    if(item.dir === 'right') {
      item.element.style.backgroundPositionY = '0px';
    } else if(item.dir === 'left') {
      item.element.style.backgroundPositionY = -CELL_SIZE + 'px';
    } else if(item.dir === 'down') {
      item.element.style.backgroundPositionY = -2 * CELL_SIZE + 'px';
    } else if(item.dir === 'up') {
      item.element.style.backgroundPositionY = -3 * CELL_SIZE + 'px';
    }
  }
  else {
    if(item.phase === 'active') {
      item.element.style.display = 'block';
      item.element.style.backgroundImage = 'url(img/' + item.type + '.png)';
      item.element.style.left = item.pos.x * CELL_SIZE + 'px';
      item.element.style.top = item.pos.y * CELL_SIZE + 'px';  
    } else {
      item.element.style.display = 'none';
    }
  }
}

const collision = (point) => {
  if(point.x < 0) {
    return {type: 'border'};
  }
  if(point.y < 0) {
    return {type: 'border'};
  }
  if(point.x >= STAGE_WIDTH) {
    return {type: 'border'};
  }
  if(point.y >= STAGE_HEIGHT) {
    return {type: 'border'};
  }

  for(let item of scene) {
    if(item.phase === 'active') {
      if(contains(point, item)) {
        return item;
      }
    }
  }

  return null;
}

document.addEventListener('keyup', (event) => {
  if(!awakePac) {
    return;
  }

  if(awakePac.phase !== 'active') {
    return;
  }

  let newPos = {
    x: awakePac.pos.x,
    y: awakePac.pos.y,
  };

  if(event.key == 'ArrowRight') {
    awakePac.dir = 'right';
    newPos.x += 1;
  } else if(event.key == 'ArrowLeft') {
    awakePac.dir = 'left';
    newPos.x -= 1;
  } else if(event.key == 'ArrowDown') {
    awakePac.dir = 'down';
    newPos.y += 1;
  } else if(event.key == 'ArrowUp') {
    awakePac.dir = 'up';
    newPos.y -= 1;
  }
  
  if(awakePac.mouth === 'open') {
    awakePac.mouth = 'close';
  } else {
    awakePac.mouth = 'open';
  }

  let colItem = collision(newPos);
  if(colItem === null) {
    awakePac.pos = newPos;
  } else if(colItem.type === 'bomb') {
    awakePac.pos = newPos;
    awakePac.phase = 'dead';
    colItem.phase = 'exploded';
    itemUpdate(colItem);
  } else if(colItem.type === 'robot') {
    awakePac.pos = newPos;
    awakePac.phase = 'dead';
    itemUpdate(colItem);
  } else if(colItem.type === 'apple') {
    awakePac.pos = newPos;
    awakePac.apples += 1;
    colItem.phase = 'picked';
    itemUpdate(colItem);
  }

  itemUpdate(awakePac);
});

for(let item of scene) {
  itemRender(item);
}