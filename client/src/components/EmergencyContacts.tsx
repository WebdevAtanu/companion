interface EmergencyContactsProps {
  emergencyContacts: { name: string; phone: string; relation: string }[]
}

export function EmergencyContacts({ emergencyContacts }: EmergencyContactsProps) {
  return (
    <article className="bg-[#f5dfd8] border-[#e4c0b6] rounded-lg shadow-[0_18px_50px_rgba(31,41,51,0.08)] p-5 grid gap-3" aria-labelledby="contacts-title">
      <div>
        <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-normal">Emergency contacts</p>
        <h2 id="contacts-title" className="text-[#1f2933] text-[22px] leading-[1.2] mt-0.5">Support circle</h2>
      </div>
      {emergencyContacts.length > 0 ? (
        emergencyContacts.map((contact) => (
          <div key={contact.phone}>
            <p>{contact.name} - {contact.relation}</p>
            <a href={`tel:${contact.phone}`} className="text-[#823723] font-bold">Call {contact.phone}</a>
          </div>
        ))
      ) : (
        <p>No emergency contacts added</p>
      )}
    </article>
  )
}
