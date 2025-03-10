import React from "react";

interface WorkshopProps {
  workshop: {
    id: number;
    title: string;
  };
}

const WorkshopItem: React.FC<WorkshopProps> = ({ workshop }) => {
  return (
    <div className="col-md-4">
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{workshop.title}</h5>
        </div>
      </div>
    </div>
  );
};

export default WorkshopItem;
