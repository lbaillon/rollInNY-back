const request = require('supertest');
const app = require('../app.js');

// TDD: Killian Cavillon
// Réalisation d'un test afin de supprimer une photo sur cloudinary.
// Utilisateur : (userToken: ddnOO9F4SA6cfR8csSP-XJ0AqsiIY__r)
// Lieu de tournage : (Pour la 'idPlace' The American Museum of Natural History - _id: 6756ad48e4b746f7c24d88f0)
// Identifiant de la photo : (publicId: z6pnd3vxoevbvngelmzt)
// Chemin public vers l'élément publicId : (usersPictures/ddnOO9F4SA6cfR8csSP-XJ0AqsiIY__r/6756ad48e4b746f7c24d88f0/z6pnd3vxoevbvngelmzt)
it('DELETE /favorites/pictures', async () => {
  const publicId = `usersPictures/ddnOO9F4SA6cfR8csSP-XJ0AqsiIY__r/6756ad48e4b746f7c24d88f0/z6pnd3vxoevbvngelmzt`;
  
  // Permet d'envoyer dans le req.body la clé publicId et sont contenu.
  const res = await request(app).delete(`/favorites/pictures`).send({ publicId }); 

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toEqual(true);
});
