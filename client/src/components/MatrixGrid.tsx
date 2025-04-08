import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import QuadrantContainer from './QuadrantContainer';
import { Task } from '@shared/schema';

const MatrixGrid = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);

  // Filter tasks by quadrant
  const getTasksByQuadrant = (quadrant: number): Task[] => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 h-[calc(100vh-240px)] min-h-[600px]">
      {/* Quadrant 1: Important/Urgent */}
      <QuadrantContainer
        quadrant={1}
        title="Important & Urgent"
        action="Do"
        tasks={getTasksByQuadrant(1)}
      />

      {/* Quadrant 2: Important/Not Urgent */}
      <QuadrantContainer
        quadrant={2}
        title="Important & Not Urgent"
        action="Schedule"
        tasks={getTasksByQuadrant(2)}
      />

      {/* Quadrant 3: Not Important/Urgent */}
      <QuadrantContainer
        quadrant={3}
        title="Not Important & Urgent"
        action="Delegate"
        tasks={getTasksByQuadrant(3)}
      />

      {/* Quadrant 4: Not Important/Not Urgent */}
      <QuadrantContainer
        quadrant={4}
        title="Not Important & Not Urgent"
        action="Eliminate"
        tasks={getTasksByQuadrant(4)}
      />
    </div>
  );
};

export default MatrixGrid;
