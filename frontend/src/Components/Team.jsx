import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Team.css';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get('https://coffeehouse-4yii.onrender.com/api/team');
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="team-container">
      <h1 className="team-heading">Our Team</h1>
      <div className="team-list">
        {teamMembers.map((member) => (
          <div key={member._id} className="team-member" tabIndex={0} role="article" aria-label={`Team member ${member.name}`}>
            {member.photo && (
              <img
                src={`https://coffeehouse-4yii.onrender.com/uploads/${member.photo}`}
                alt={member.name}
                className="team-photo"
              />
            )}
            <h3 className="team-member-name">{member.name}</h3>
            <p className="team-member-role">{member.position}</p>
            <p className="team-member-bio">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
