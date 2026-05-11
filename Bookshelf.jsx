import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown, ChevronRight, X, GripVertical, Download, BookOpen, BookMarked, BookCheck, ArrowUp, ArrowDown, FolderPlus, Settings2 } from 'lucide-react';

// ============================================================
// SEED DATA — 784 books, oldest-added first
// ============================================================
const SEED_BOOKS = [
  {"id": "B01I4FPNNQ", "t": "A Crack In Creation: A Nobel Prize Winner's Insight into the Future of Genetic Engineering", "a": "Jennifer A. Doudna, Samuel H. Sternberg", "p": 281, "d": "CRISPR co-inventor Doudna on the science and ethics of gene editing.", "c": "Science"},
  {"id": "B07BVF1Z6Z", "t": "The Circadian Code: Lose Weight, Supercharge Your Energy, and Transform Your Health from Morning to Midnight: Longevity Book", "a": "Satchin Panda PhD", "p": 304, "d": "Circadian biologist on time-restricted eating and aligning life with the body clock.", "c": "Science"},
  {"id": "B083RZ8Q4S", "t": "Resetting the Table: Straight Talk About the Food We Grow and Eat", "a": "Robert L. Paarlberg", "p": 256, "d": "Food-policy scholar pushes back on common claims about modern agriculture.", "c": "Science"},
  {"id": "0679720200", "t": "The Stranger (Vintage International)", "a": "Albert Camus, Matthew Ward", "p": 123, "d": "Camus's existentialist novel of Meursault, the indifferent killer of an Algerian man.", "c": "Classics"},
  {"id": "0679720219", "t": "The Plague", "a": "Albert Camus, Stuart Gilbert", "p": 308, "d": "Camus's allegory of plague-stricken Oran and human resistance to absurd suffering.", "c": "Classics"},
  {"id": "0553208845", "t": "Siddhartha: A Novel", "a": "Hermann Hesse, Hilda Rosner", "p": 152, "d": "Hesse's spiritual novel of a Brahmin's son seeking enlightenment in ancient India.", "c": "Classics"},
  {"id": "B00J8VN0YU", "t": "Mr. Mercedes: A Novel", "a": "Stephen King, Will Patton", "p": null, "d": "King's first Hodges thriller: a retired detective hunts a mass-murdering driver.", "c": "Fiction"},
  {"id": "B018RE0APU", "t": "End of Watch: A Novel", "a": "Stephen King, Will Patton", "p": null, "d": "Final Bill Hodges novel: Brady Hartsfield's mind weaponized against suicidal teens.", "c": "Fiction"},
  {"id": "B00U7U0CJW", "t": "Finders Keepers: A Novel", "a": "Stephen King, Will Patton", "p": null, "d": "Middle Hodges book: a missing manuscript draws Hodges into a writer's deadly fan.", "c": "Fiction"},
  {"id": "B002PJ86LE", "t": "The Divine Comedy", "a": "Dante Alighieri, Charlton Griffin", "p": null, "d": "Dante's medieval poem journeying through Hell, Purgatory, and Paradise.", "c": "Classics"},
  {"id": "B00ENIRIWS", "t": "Murder on the Orient Express: A Hercule Poirot Mystery: The Official Authorized Edition", "a": "Agatha Christie, Dan Stevens", "p": null, "d": "Christie's classic Poirot mystery aboard a snowbound luxury train.", "c": "Fiction"},
  {"id": "B00ENI0HUI", "t": "And Then There Were None", "a": "Agatha Christie, Dan Stevens", "p": null, "d": "Ten strangers on an island die one by one per a chilling nursery rhyme.", "c": "Fiction"},
  {"id": "0140449159", "t": "The Prince (Penguin Classics)", "a": "Niccolo Machiavelli, George Bull", "p": 140, "d": "Renaissance treatise on political pragmatism and the acquisition of power.", "c": "Classics"},
  {"id": "081331951X", "t": "The Art of War (Translated by Ralph D. Sawyer)", "a": "Sun Tzu, Ralph D. Sawyer", "p": 480, "d": "Sun Tzu's ancient Chinese classic on strategy and warfare with extensive commentary.", "c": "Classics"},
  {"id": "0520290887", "t": "The Principia: The Authoritative Translation and Guide: Mathematical Principles of Natural Philosophy", "a": "Sir Isaac Newton, I. Bernard Cohen", "p": 992, "d": "Newton's Principia in modern English with a guide to its mathematics and physics.", "c": "Science"},
  {"id": "0198805322", "t": "The Oxford Handbook of the History of Physics", "a": "Jed Z. Buchwald, Robert Fox", "p": 672, "d": "Scholarly handbook surveying the history of physics from antiquity to today.", "c": "Science"},
  {"id": "B005745MYI", "t": "The Man Who Mistook His Wife for a Hat: and Other Clinical Tales", "a": "Oliver Sacks, Jonathan Davis", "p": null, "d": "Sacks's classic case studies of strange neurological conditions and their patients.", "c": "Science"},
  {"id": "0268016976", "t": "St. Anselm's Proslogion, with A Reply on Behalf of the Fool by Gaunilo and The Author's Reply to Gaunilo", "a": "Saint Anselm, Gaunilo", "p": 160, "d": "Anselm's ontological argument with Gaunilo's response and Anselm's reply.", "c": "Philosophy"},
  {"id": "0199535752", "t": "Natural Theology (Oxford World's Classics)", "a": "William Paley, Matthew D. Eddy", "p": 336, "d": "Paley's classic 1802 design argument: the watchmaker analogy for divine creation.", "c": "Philosophy"},
  {"id": "0872205657", "t": "Proslogion, with the Replies of Gaunilo and Anselm", "a": "Anselm, Thomas Williams", "p": 96, "d": "Anselm's ontological proof for God's existence with Gaunilo's famous critique.", "c": "Philosophy"},
  {"id": "B00515I6K0", "t": "Moby Dick: or the Whale", "a": "Herman Melville, Mark Nelson", "p": null, "d": "Melville's epic of Captain Ahab's monomaniacal hunt for the white whale.", "c": "Classics"},
  {"id": "0199213615", "t": "The Nicomachean Ethics (Oxford World's Classics)", "a": "Aristotle, David Ross", "p": 368, "d": "Aristotle's foundational treatise on virtue, character, and the good life.", "c": "Classics"},
  {"id": "0199537003", "t": "North and South (Oxford World's Classics)", "a": "Elizabeth Gaskell, Angus Easson", "p": 480, "d": "Gaskell's industrial novel: a southern lady moves to the cotton-mill North.", "c": "Classics"},
  {"id": "0199589240", "t": "Diogenes the Cynic: Sayings and Anecdotes, With Other Popular Moralists", "a": "Diogenes the Cynic, Robin Hard", "p": 336, "d": "Sayings of Diogenes the Cynic and other ancient popular philosophers.", "c": "Philosophy"},
  {"id": "B07V5SMTS8", "t": "Meditations", "a": "Marcus Aurelius, Digital Fire", "p": 250, "d": "Marcus Aurelius's private Stoic notebook on duty, mortality, and self-mastery.", "c": "Classics"},
  {"id": "0199540063", "t": "The Nature of the Gods (Oxford World's Classics)", "a": "Cicero, P. G. Walsh", "p": 256, "d": "Cicero's dialogue on the existence and nature of the gods, from a Roman skeptic's view.", "c": "Classics"},
  {"id": "019953926X", "t": "Agricola and Germany (Oxford World's Classics)", "a": "Tacitus, Anthony Birley", "p": 160, "d": "Tacitus's biography of his father-in-law Agricola and ethnography of Germanic tribes.", "c": "Classics"},
  {"id": "0199537348", "t": "Le Morte Darthur: The Winchester Manuscript (Oxford World's Classics)", "a": "Sir Thomas Malory, Helen Cooper", "p": 912, "d": "The legendary Arthurian cycle as preserved in Malory's Winchester Manuscript.", "c": "Classics"},
  {"id": "B000WGUISQ", "t": "Beowulf", "a": "uncredited, J.B. Bessinger", "p": null, "d": "Anglo-Saxon epic of Beowulf, slayer of Grendel, his mother, and a dragon.", "c": "Classics"},
  {"id": "0199535663", "t": "The Histories (Oxford World's Classics)", "a": "Herodotus, Robin Waterfield", "p": 816, "d": "Herodotus's foundational history of the Greco-Persian wars and the ancient world.", "c": "Classics"},
  {"id": "B08JJ5XX1T", "t": "Villette", "a": "Charlotte Bronte", "p": 480, "d": "Bronte's last novel: a lonely English teacher's repressed life in Belgium.", "c": "Classics"},
  {"id": "0199540268", "t": "The Gallic War: Seven Commentaries on The Gallic War with an Eighth Commentary by Aulus Hirtius (Oxford World's Classics)", "a": "Julius Caesar, Carolyn Hammond", "p": 352, "d": "Caesar's first-person account of his conquest of Gaul, with Hirtius's continuation.", "c": "Classics"},
  {"id": "0199540322", "t": "Gorgias (Oxford World's Classics)", "a": "Plato, Robin Waterfield", "p": 192, "d": "Plato's dialogue on rhetoric, justice, and how to live the good life.", "c": "Classics"},
  {"id": "0199536589", "t": "Jacob's Room (Oxford World's Classics)", "a": "Virginia Woolf, Kate Flint", "p": 224, "d": "Woolf's experimental novel of Jacob Flanders, glimpsed through fragmentary impressions.", "c": "Classics"},
  {"id": "B005EEHMJ4", "t": "A Portrait of the Artist as a Young Man (Oxford World's Classics)", "a": "James Joyce, Jeri Johnson", "p": 320, "d": "Joyce's modernist Künstlerroman of Stephen Dedalus's Irish-Catholic awakening.", "c": "Classics"},
  {"id": "B00ARI2G5M", "t": "Uncle Tom's Cabin (Oxford World's Classics)", "a": "Harriet Beecher Stowe, Jean Fagan Yellin", "p": 608, "d": "Stowe's anti-slavery novel that helped catalyze abolitionist sentiment in the US.", "c": "Classics"},
  {"id": "0199675341", "t": "The Poetic Edda (Oxford World's Classics)", "a": "Carolyne Larrington", "p": 384, "d": "Old Norse mythological and heroic poems including Voluspa and Havamal.", "c": "Classics"},
  {"id": "0199535779", "t": "Selected Tales (Oxford World's Classics)", "a": "Edgar Allan Poe, David Van Leer", "p": 608, "d": "Poe's gothic, mystery, and detective tales: Usher, Tell-Tale Heart, Rue Morgue.", "c": "Classics"},
  {"id": "0199555079", "t": "Troilus and Criseyde (Oxford World's Classics)", "a": "Geoffrey Chaucer, Barry Windeatt", "p": 576, "d": "Chaucer's Trojan War love poem: Troilus's tragic affair with the unfaithful Criseyde.", "c": "Classics"},
  {"id": "0198814046", "t": "Frankenstein: or `The Modern Prometheus': The 1818 Text (Oxford World's Classics Hardback Collection)", "a": "Mary Wollstonecraft Shelley, Nick Groom", "p": 336, "d": "The original 1818 Frankenstein with Mary Shelley's first preface.", "c": "Classics"},
  {"id": "0199554951", "t": "Daphnis and Chloe (Oxford World's Classics)", "a": "Longus, Ronald McCail", "p": 160, "d": "Ancient Greek pastoral romance of two foundlings discovering love on Lesbos.", "c": "Classics"},
  {"id": "B07SB171Y4", "t": "Jane Eyre (Oxford World's Classics)", "a": "Charlotte Brontë, Margaret Smith", "p": 576, "d": "Bronte's classic of plain-Jane governess, brooding Rochester, and the secret in the attic.", "c": "Classics"},
  {"id": "0199537895", "t": "Don Quixote de la Mancha (Oxford World's Classics)", "a": "Miguel de Cervantes Saavedra, Charles Jarvis", "p": 1056, "d": "Cervantes's parody of chivalric romance: the deluded knight and his earthy squire.", "c": "Classics"},
  {"id": "0199540179", "t": "Three Major Plays (Oxford World's Classics)", "a": "Lope de Vega, Gwynne Edwards", "p": 448, "d": "Three plays by Spain's Golden Age master, including Fuente Ovejuna.", "c": "Classics"},
  {"id": "0199563284", "t": "Satires and Epistles (Oxford World's Classics)", "a": "Horace, John Davie", "p": 192, "d": "Horace's verse epistles and witty hexameter satires on Roman manners.", "c": "Classics"},
  {"id": "0199540667", "t": "The Satires (Oxford World's Classics)", "a": "Juvenal, Niall Rudd", "p": 320, "d": "Juvenal's biting Roman satires lampooning the vices of imperial society.", "c": "Classics"},
  {"id": "0199555273", "t": "The Complete Odes and Epodes (Oxford World's Classics)", "a": "Horace, David West", "p": 336, "d": "Horace's complete lyric poetry: odes celebrating wine, love, and the carpe-diem ethos.", "c": "Classics"},
  {"id": "0199555990", "t": "Britannicus, Phaedra, Athaliah (Oxford World's Classics)", "a": "Jean Racine, C. H. Sisson", "p": 192, "d": "Three of Racine's neoclassical French tragedies on Roman and biblical themes.", "c": "Classics"},
  {"id": "0199540187", "t": "The Misanthrope, Tartuffe, and Other Plays (Oxford World's Classics)", "a": "Molière, Maya Slater", "p": 528, "d": "Five comedies by Moliere skewering hypocrisy, religion, and bourgeois pretension.", "c": "Classics"},
  {"id": "1903436591", "t": "King Lear (Arden Shakespeare: Third Series)", "a": "William Shakespeare, R.A. Foakes", "p": 496, "d": "Authoritative Arden edition of Shakespeare's tragedy of madness and filial betrayal.", "c": "Classics"},
  {"id": "1903436818", "t": "The Merchant Of Venice: Third Series (The Arden Shakespeare Third Series, 16)", "a": "William Shakespeare, John Drakakis", "p": 528, "d": "Arden edition of Shakespeare's controversial comedy of Shylock and the bond.", "c": "Classics"},
  {"id": "1586638521", "t": "Spark Notes No Fear Shakespeare Othello (SparkNotes No Fear Shakespeare)", "a": "William Shakespeare, Sparknotes", "p": 256, "d": "Side-by-side Shakespeare and modern translation of Othello for students.", "c": "Classics"},
  {"id": "0743273567", "t": "The Great Gatsby: The Only Authorized Edition", "a": "F. Scott Fitzgerald", "p": 180, "d": "Fitzgerald's Jazz-Age tragedy of Gatsby's doomed love for Daisy Buchanan.", "c": "Classics"},
  {"id": "0226768686", "t": "Oedipus the King", "a": "Sophocles, David Grene", "p": 96, "d": "Sophocles's tragedy of the king who unwittingly fulfilled the dread prophecy.", "c": "Classics"},
  {"id": "0374515360", "t": "The Complete Stories (FSG Classics)", "a": "Flannery O'Connor", "p": 608, "d": "O'Connor's collected Southern Gothic short fiction with violence and grace.", "c": "Classics"},
  {"id": "0140268863", "t": "The Odyssey", "a": "Homer, Robert Fagles", "p": 560, "d": "Fagles's acclaimed verse translation of Homer's epic of Odysseus's return.", "c": "Classics"},
  {"id": "0307278441", "t": "The Bluest Eye: A Novel (Vintage International)", "a": "Toni Morrison, Jacqueline Woodson", "p": 224, "d": "Morrison's debut: a young Black girl in 1940s Ohio yearns for blue eyes.", "c": "Classics"},
  {"id": "0140443126", "t": "The Cid, Cinna, the Theatrical Illusion (Penguin Classics)", "a": "Pierre Corneille, John Cairncross", "p": 320, "d": "Three plays by France's Corneille, including the swashbuckling Le Cid.", "c": "Classics"},
  {"id": "1087113490", "t": "Candide", "a": "Voltaire", "p": 96, "d": "Voltaire's satire of Leibnizian optimism in the misadventures of naive Candide.", "c": "Classics"},
  {"id": "019953781X", "t": "Oresteia (Oxford World's Classics)", "a": "Aeschylus, Christopher Collard", "p": 272, "d": "Aeschylus's trilogy on the bloody aftermath of Agamemnon's return from Troy.", "c": "Classics"},
  {"id": "0525564454", "t": "The Myth of Sisyphus (Vintage International)", "a": "Albert Camus", "p": 224, "d": "Camus's philosophical essay on absurdity and the imperative to imagine Sisyphus happy.", "c": "Classics"},
  {"id": "0199540225", "t": "Don Juan: And Other Plays (Oxford World's Classics)", "a": "Moliere, George Graveley", "p": 384, "d": "Moliere's verse comedies including Don Juan and The School for Wives.", "c": "Classics"},
  {"id": "0743261690", "t": "Gilgamesh: A New English Version", "a": "Stephen Mitchell", "p": 304, "d": "Mitchell's verse rendition of the Babylonian epic of Gilgamesh and Enkidu.", "c": "Classics"},
  {"id": "0140135588", "t": "Ethics: Inventing Right and Wrong", "a": "J. L. Mackie", "p": 256, "d": "Mackie's defense of moral skepticism: an error theory of ethical statements.", "c": "Philosophy"},
  {"id": "B073RNL4NY", "t": "An Analysis of Edmund Gettier's Is Justified True Belief Knowledge? (The Macat Library)", "a": "Jason Schukraft", "p": null, "d": "Macat analysis of Gettier's three-page paper that broke the JTB theory of knowledge.", "c": "Philosophy"},
  {"id": "B073RNRBDL", "t": "An Analysis of Henry Kissinger's World Order: Reflections on the Character of Nations and the Course of History (The Macat Library)", "a": "Bryan Gibson", "p": null, "d": "Macat analysis of Kissinger's argument for an updated Westphalian world order.", "c": "Philosophy"},
  {"id": "B01N1ZP5JW", "t": "Descartes: Meditations on First Philosophy: With Selections from the Objections and Replies (Cambridge Texts in the History of Philosophy)", "a": "John Cottingham", "p": 192, "d": "Cottingham's edition of Descartes's Meditations with key replies and objections.", "c": "Philosophy"},
  {"id": "0199540365", "t": "Pensées and Other Writings (Oxford World's Classics)", "a": "Blaise Pascal, Honor Levi", "p": 336, "d": "Pascal's apologetic fragments and other writings, including the famous Wager.", "c": "Philosophy"},
  {"id": "B00OR0SYES", "t": "The Complete Poetry", "a": "George Herbert, John Drury", "p": null, "d": "Complete poetry of George Herbert, the great English metaphysical religious poet.", "c": "Classics"},
  {"id": "B004L628UY", "t": "An Enquiry Concerning Human Understanding, 2nd Edition (Annotated)) (Hackett Classics)", "a": "David Hume, Eric Steinberg", "p": 160, "d": "Hume's empiricist classic on causation, induction, and the limits of reason.", "c": "Philosophy"},
  {"id": "B016RBMJZO", "t": "Plato: Five Dialogues: Euthyphro, Apology, Crito, Meno, Phaedo (Hackett Classics)", "a": "Plato, John M. Cooper", "p": 160, "d": "Plato's Socratic dialogues including Apology and Phaedo, in Cooper's edition.", "c": "Philosophy"},
  {"id": "0872205932", "t": "Prolegomena to Any Future Metaphysics: and the Letter to Marcus Herz, February 1772 (Hackett Classics)", "a": "Immanuel Kant, James W. Ellington", "p": 144, "d": "Kant's introduction to transcendental idealism for non-specialists.", "c": "Philosophy"},
  {"id": "0674290712", "t": "Fact, Fiction, and Forecast: Fourth Edition", "a": "Goodman", "p": 144, "d": "Goodman's seminal new riddle of induction: the grue paradox.", "c": "Philosophy"},
  {"id": "0558882846", "t": "Introducing Psychology: Brain, Person, Group (4th Edition)", "a": "Stephen M. Kosslyn, Robin S. Rosenberg", "p": null, "d": "Introductory psychology textbook covering brain, individual, and social levels.", "c": "Science"},
  {"id": "B088FZL1JZ", "t": "The Magic Mountain", "a": "Thomas Mann, David Rintoul", "p": null, "d": "Mann's modernist epic of Hans Castorp's seven years at an Alpine sanatorium.", "c": "Classics"},
  {"id": "0850364787", "t": "The Communist Manifesto", "a": "Karl Marx, Friedrich Engels", "p": 96, "d": "Marx and Engels's 1848 call for working-class revolution and the abolition of class.", "c": "Philosophy"},
  {"id": "0395925037", "t": "Mein Kampf", "a": "Adolf Hitler, Ralph Manheim", "p": 720, "d": "Hitler's autobiographical political manifesto written during his 1924 imprisonment.", "c": "History"},
  {"id": "B0041OT9W6", "t": "The Diary of a Young Girl", "a": "Anne Frank, Otto H. Frank", "p": 304, "d": "Anne Frank's diary written while hiding from the Nazis in an Amsterdam annex.", "c": "Classics"},
  {"id": "0961392177", "t": "Beautiful Evidence", "a": "Edward R. Tufte", "p": 213, "d": "Tufte's elegant guide to evidence presentation in science, news, and graphics.", "c": "Programming & CS"},
  {"id": "B077W49477", "t": "Shakespeare: The Complete Collection", "a": "William Shakespeare", "p": null, "d": "Complete plays, sonnets, and poems of William Shakespeare in one Kindle volume.", "c": "Classics"},
  {"id": "B07HH94ZBH", "t": "Oscar Wilde: The Complete Works", "a": "Oscar Wilde", "p": null, "d": "Complete works of Oscar Wilde: plays, poetry, fiction, and critical writings.", "c": "Classics"},
  {"id": "B0796B5854", "t": "Franz Kafka: The Best Works", "a": "Franz Kafka", "p": null, "d": "Selected best fiction of Franz Kafka including The Trial and The Metamorphosis.", "c": "Classics"},
  {"id": "B07B4HSJMC", "t": "James Joyce: The Complete Collection", "a": "James Joyce", "p": null, "d": "Complete fiction and criticism of James Joyce, including Ulysses and Dubliners.", "c": "Classics"},
  {"id": "B07PYXX1KB", "t": "Fyodor Dostoyevsky: The Complete Novels", "a": "Fyodor Dostoyevsky", "p": null, "d": "Complete novels of Dostoyevsky from Poor Folk to The Brothers Karamazov.", "c": "Classics"},
  {"id": "B07NNPFZGJ", "t": "Leo Tolstoy: The Complete Novels and Novellas", "a": "Leo Tolstoy", "p": null, "d": "Complete novels and novellas of Tolstoy in one Kindle compilation.", "c": "Classics"},
  {"id": "B07KQ27WFX", "t": "Virginia Woolf: The Complete Works", "a": "Virginia Woolf", "p": null, "d": "Complete fiction, essays, and diary excerpts of Virginia Woolf.", "c": "Classics"},
  {"id": "0198520115", "t": "The Principles of Quantum Mechanics (International Series of Monographs on Physics)", "a": "P. A. M. Dirac", "p": 336, "d": "Dirac's foundational 1930 textbook formulating the bra-ket framework of QM.", "c": "Science"},
  {"id": "0197555764", "t": "On the Fringe: Where Science Meets Pseudoscience", "a": "Michael D. Gordin", "p": 224, "d": "Historian Gordin maps the shifting boundary between science and pseudoscience.", "c": "History"},
  {"id": "B004MXUG0U", "t": "Why the West Rules - for Now: The Patterns of History, and What They Reveal About the Future", "a": "Ian Morris, Antony Ferguson", "p": 768, "d": "Morris uses social development indices to compare Eastern and Western trajectories.", "c": "History"},
  {"id": "B004YKSXYW", "t": "A Little History of the World (Little Histories)", "a": "E. H. Gombrich, Clifford Harper", "p": 288, "d": "Gombrich's lucid history of humanity from the Stone Age to WWII, written for children.", "c": "History"},
  {"id": "B005W9XXLW", "t": "A Little History of Philosophy (Little Histories)", "a": "Nigel Warburton", "p": 272, "d": "Warburton's tour of Western philosophy through forty thinkers from Socrates onward.", "c": "History"},
  {"id": "B009JBPXU8", "t": "A Little History of Science (Little Histories)", "a": "William Bynum", "p": 288, "d": "Bynum's chronological history of scientific discovery from antiquity to genomics.", "c": "History"},
  {"id": "B00FOR57SY", "t": "A Little History of Literature (Little Histories)", "a": "John Sutherland", "p": 272, "d": "Sutherland's accessible history of Western literature across forty short chapters.", "c": "History"},
  {"id": "B0106O2RN2", "t": "A Little History of the United States (Little Histories)", "a": "James West Davidson", "p": 336, "d": "Davidson's compact narrative of US history from pre-Columbian times to today.", "c": "History"},
  {"id": "B01J26RR5S", "t": "A Little History of Religion (Little Histories)", "a": "Richard Holloway", "p": 256, "d": "Holloway's accessible global history of religious belief and practice.", "c": "History"},
  {"id": "B06XDHTFTL", "t": "A Little History of Economics (Little Histories)", "a": "Niall Kishtainy", "p": 256, "d": "Kishtainy's history of economic thought from Aristotle to behavioral economics.", "c": "History"},
  {"id": "B07BZQ7RN9", "t": "A Little History of Archaeology (Little Histories)", "a": "Brian Fagan", "p": 256, "d": "Fagan's accessible global history of archaeological discovery and method.", "c": "History"},
  {"id": "B085CMPPHV", "t": "A Little History of Poetry (Little Histories)", "a": "John Carey", "p": 320, "d": "Carey's history of poetry from epic Gilgamesh to twentieth-century modernism.", "c": "History"},
  {"id": "B005FFPMP8", "t": "Cities", "a": "John Reader", "p": 368, "d": "Reader's global history of cities and how they shape and are shaped by humanity.", "c": "History"},
  {"id": "0007341393", "t": "Atlantic: A Vast Ocean of a Million Stories", "a": "Simon Winchester", "p": 496, "d": "Winchester's biography of the Atlantic Ocean: exploration, trade, and ecology.", "c": "History"},
  {"id": "0198814399", "t": "The Meaning of Everything: The Story of the Oxford English Dictionary", "a": "Simon Winchester OBE", "p": 260, "d": "Engaging history of how the Oxford English Dictionary was compiled.", "c": "History"},
  {"id": "0060905662", "t": "The Mediterranean and the Mediterranean World in the Age of Philip II, Vol. 1", "a": "Fernand Braudel", "p": 672, "d": "Braudel's Annales-school masterpiece on Mediterranean civilization, vol 1.", "c": "History"},
  {"id": "0520203305", "t": "The Mediterranean: And the Mediterranean World in the Age of Philip II (Volume II)", "a": "Fernand Braudel", "p": 768, "d": "Braudel's masterwork on Mediterranean civilization, vol 2.", "c": "History"},
  {"id": "0060935723", "t": "Empires of the Word: A Language History of the World", "a": "Nicholas Ostler", "p": 640, "d": "Ostler's history of the world told through its dominant languages.", "c": "History"},
  {"id": "1439110123", "t": "The Prize: The Epic Quest for Oil, Money & Power", "a": "Daniel Yergin", "p": 912, "d": "Yergin's Pulitzer-winning history of the petroleum industry and geopolitics.", "c": "History"},
  {"id": "B0058E3K5K", "t": "Who Owns Antiquity?: Museums and the Battle over Our Ancient Heritage", "a": "James Cuno", "p": 240, "d": "Cuno argues against repatriation, defending museums' encyclopedic collections.", "c": "History"},
  {"id": "0195171578", "t": "The Landscape of History: How Historians Map the Past", "a": "John Lewis Gaddis", "p": 208, "d": "Cold War historian Gaddis on the craft and method of history.", "c": "History"},
  {"id": "0333977017", "t": "What is History?: With a new introduction by Richard J. Evans", "a": "E. Carr, R. Evans", "p": 192, "d": "Carr's classic 1961 lectures on what history is, with a new introduction.", "c": "History"},
  {"id": "019285352X", "t": "History: A Very Short Introduction", "a": "John H. Arnold", "p": 160, "d": "Arnold's brisk introduction to historical method and historiographical debates.", "c": "History"},
  {"id": "0521357454", "t": "That Noble Dream: The 'Objectivity Question' and the American Historical Profession (Ideas in Context, Series Number 13)", "a": "Peter Novick", "p": 672, "d": "Novick's classic history of the objectivity ideal in American historical writing.", "c": "History"},
  {"id": "0190920556", "t": "A Modern History of Japan: From Tokugawa Times to the Present", "a": "Andrew Gordon", "p": 432, "d": "Gordon's standard textbook on Japanese history from the 17th century to today.", "c": "History"},
  {"id": "0394751728", "t": "War Without Mercy: Race and Power in the Pacific War", "a": "John W. Dower", "p": 416, "d": "Dower's classic on the racial dimensions of WWII in the Pacific theater.", "c": "History"},
  {"id": "0674057473", "t": "America's Geisha Ally: Reimagining the Japanese Enemy", "a": "Shibusawa", "p": 432, "d": "Shibusawa on how postwar America re-imagined Japan as a feminized ally.", "c": "History"},
  {"id": "B003JMF8P8", "t": "Under the Loving Care of the Fatherly Leader: North Korea and the Kim Dynasty", "a": "Bradley K. Martin", "p": 912, "d": "Martin's exhaustive insider history of Kim Il-sung and Kim Jong-il's North Korea.", "c": "History"},
  {"id": "0140285512", "t": "Embracing Defeat: Japan in the Aftermath of World War II", "a": "John W. Dower", "p": 688, "d": "Pulitzer-winning history of Japan during the postwar US occupation.", "c": "History"},
  {"id": "0226794210", "t": "Rearranging the Landscape of the Gods: The Politics of a Pilgrimage Site in Japan, 1573-1912 (Studies of the Weatherhead East Asian Institute)", "a": "Sarah Thal", "p": 368, "d": "Microhistory of Konpira shrine and pilgrimage in modernizing Japan.", "c": "History"},
  {"id": "145388632X", "t": "Das Kapital: A Critque of Political Economy", "a": "Karl Marx, Samuel Moore", "p": 608, "d": "Marx's foundational critique of capitalist political economy, vol 1.", "c": "Philosophy"},
  {"id": "0140275010", "t": "Cod: A Biography of the Fish that Changed the World", "a": "Mark Kurlansky", "p": 304, "d": "Kurlansky's history of the Atlantic cod fishery and its global influence.", "c": "History"},
  {"id": "0142001619", "t": "Salt: A World History", "a": "Mark Kurlansky", "p": 484, "d": "Kurlansky's global history of salt: production, trade, and cultural meaning.", "c": "History"},
  {"id": "081296621X", "t": "The Balkans: A Short History (Modern Library Chronicles)", "a": "Mark Mazower", "p": 208, "d": "Mazower's compact history of the Balkans from late antiquity to today.", "c": "History"},
  {"id": "0521773571", "t": "Yugoslavia as History: Twice There Was a Country", "a": "John R. Lampe", "p": 448, "d": "Lampe's history of the rise and fall of Yugoslavia in the 20th century.", "c": "History"},
  {"id": "0143037757", "t": "Postwar: A History of Europe Since 1945", "a": "Tony Judt", "p": 960, "d": "Judt's sweeping history of post-1945 Europe, both East and West.", "c": "History"},
  {"id": "B00338QEMY", "t": "George, Nicholas and Wilhelm: Three Royal Cousins and the Road to World War I", "a": "Miranda Carter", "p": 528, "d": "Carter on the three royal cousins—George V, Nicholas II, Wilhelm II—on the road to WWI.", "c": "History"},
  {"id": "0465031471", "t": "Bloodlands", "a": "Timothy Snyder", "p": 560, "d": "Snyder on the lands between Hitler and Stalin where 14 million civilians were murdered.", "c": "History"},
  {"id": "0393327973", "t": "The Dictators: Hitler's Germany, Stalin's Russia", "a": "Richard Overy Ph.D.", "p": 864, "d": "Overy's comparative study of Hitler's Germany and Stalin's Soviet Union.", "c": "History"},
  {"id": "B001VB5DL8", "t": "Darkness at Dawn: The Rise of the Russian Criminal State", "a": "David Satter", "p": 336, "d": "Satter on the criminalization of post-Soviet Russia under Yeltsin.", "c": "History"},
  {"id": "0140247688", "t": "Russia under the Old Regime: Second Edition", "a": "Richard Pipes", "p": 368, "d": "Pipes's classic interpretation of pre-revolutionary Russian autocracy.", "c": "History"},
  {"id": "0679736603", "t": "The Russian Revolution", "a": "Richard Pipes", "p": 864, "d": "Pipes's narrative history of Russia from 1899 through the Bolshevik takeover.", "c": "History"},
  {"id": "0679761845", "t": "Russia Under the Bolshevik Regime", "a": "Richard Pipes", "p": 608, "d": "Pipes's continuation: the consolidation of Bolshevik power 1918-1924.", "c": "History"},
  {"id": "B0793YG5KN", "t": "The Russian Revolution", "a": "Sheila Fitzpatrick", "p": 208, "d": "Fitzpatrick's revisionist short history of the Russian Revolution.", "c": "History"},
  {"id": "1610390709", "t": "The Oligarchs: Wealth And Power In The New Russia", "a": "David E Hoffman", "p": 576, "d": "Hoffman's reportage on the rise of Russia's post-Soviet billionaires.", "c": "History"},
  {"id": "1400032199", "t": "1861: The Civil War Awakening (Vintage Civil War Library)", "a": "Adam Goodheart", "p": 560, "d": "Goodheart's narrative of the year that began the American Civil War.", "c": "History"},
  {"id": "B003J48BMI", "t": "Arc of Justice: A Saga of Race, Civil Rights, and Murder in the Jazz Age", "a": "Kevin Boyle", "p": 432, "d": "Pulitzer-winning study of a 1925 Detroit murder trial and Jim Crow North.", "c": "History"},
  {"id": "B08YZ52WH7", "t": "Red Hills and Cotton: An Upcountry Memory (Southern Classics)", "a": "Ben Robertson, Lacy K. Ford", "p": 288, "d": "Robertson's lyrical 1942 memoir of South Carolina cotton-country boyhood.", "c": "History"},
  {"id": "B007UH91KG", "t": "Black Majority", "a": "Peter Wood", "p": 368, "d": "Wood's classic on the African origins of South Carolina's slave society.", "c": "History"},
  {"id": "019531588X", "t": "The Glorious Cause: The American Revolution, 1763-1789 (Oxford History of the United States)", "a": "Robert Middlekauff", "p": 760, "d": "Middlekauff's standard one-volume history of the American Revolution.", "c": "History"},
  {"id": "0002008955", "t": "Who Killed Canadian History? Revised Edition", "a": "J. L. Granatstein", "p": 192, "d": "Granatstein's polemic on the decline of national history teaching in Canada.", "c": "History"},
  {"id": "0773536957", "t": "The Empire Within: Postcolonial Thought and Political Activism in Sixties Montreal (Études d’histoire du Québec / Studies on the History of Quebec, 23) (Volume 23)", "a": "Sean Mills", "p": 336, "d": "Mills on the Quebec student movement, decolonization, and the New Left.", "c": "History"},
  {"id": "0887556728", "t": "Toward Defining the Prairies: Region, Culture, and History", "a": "Robert Wardhaugh", "p": 384, "d": "Essays on the place of the Canadian Prairies in regional and national identity.", "c": "History"},
  {"id": "0743223136", "t": "John Adams", "a": "David McCullough", "p": 752, "d": "McCullough's Pulitzer-winning biography of the second US president.", "c": "History"},
  {"id": "019516895X", "t": "Battle Cry of Freedom: The Civil War Era", "a": "James M. McPherson", "p": 944, "d": "McPherson's Pulitzer-winning narrative of the American Civil War.", "c": "History"},
  {"id": "B0744N8LFW", "t": "The Republic for Which It Stands: The United States during Reconstruction and the Gilded Age, 1865-1896 (Oxford History of the United States)", "a": "Richard White", "p": null, "d": "Oxford history of Reconstruction and the Gilded Age, 1865-1896.", "c": "History"},
  {"id": "B06XHNMKY2", "t": "The American Century and Beyond: U.S. Foreign Relations, 1893-2014 (Oxford History of the United States)", "a": "George C. Herring", "p": null, "d": "Herring on US foreign relations from the Spanish-American War through Obama.", "c": "History"},
  {"id": "B06XHM3HXB", "t": "Years of Peril and Ambition: U.S. Foreign Relations, 1776-1921 (Oxford History of the United States)", "a": "George C. Herring", "p": null, "d": "Herring on US foreign relations from the Founding to WWI.", "c": "History"},
  {"id": "B002SKDGOM", "t": "Empire of Liberty: A History of the Early Republic, 1789-1815 (Oxford History of the United States Book 4)", "a": "Gordon S. Wood", "p": 816, "d": "Wood's Bancroft-winning Oxford history of the Early Republic.", "c": "History"},
  {"id": "B001MTXSTS", "t": "From Colony to Superpower: U.S. Foreign Relations since 1776 (Oxford History of the United States Book 12)", "a": "George C. Herring", "p": 1056, "d": "Herring's one-volume history of US foreign relations since independence.", "c": "History"},
  {"id": "B0017QNL70", "t": "What Hath God Wrought: The Transformation of America, 1815-1848 (Oxford History of the United States Book 5)", "a": "Daniel Walker Howe", "p": 928, "d": "Howe's Pulitzer-winning Oxford history of antebellum America.", "c": "History"},
  {"id": "B002TQKRZQ", "t": "Restless Giant: The United States from Watergate to Bush v. Gore (Oxford History of the United States Book 11)", "a": "James T. Patterson", "p": 464, "d": "Patterson's Oxford history of the United States from Watergate to 2000.", "c": "History"},
  {"id": "B002NXOQLQ", "t": "Battle Cry of Freedom: The Civil War Era (Oxford History of the United States Book 6)", "a": "James M. McPherson", "p": 944, "d": "Same as the print Battle Cry of Freedom — Pulitzer-winning Civil War history.", "c": "History"},
  {"id": "B004TW1ZPO", "t": "The American People in the Great Depression: Freedom from Fear, Part One (Oxford History of the United States Book 9)", "a": "David M. Kennedy", "p": 496, "d": "Kennedy's Pulitzer-winning Oxford history of the New Deal era.", "c": "History"},
  {"id": "B004UP9A4S", "t": "The American People in World War II: Freedom from Fear, Part Two (Oxford History of the United States Book 9)", "a": "David M. Kennedy", "p": 480, "d": "Companion volume on the American home and battle fronts during WWII.", "c": "History"},
  {"id": "B0117SLJH6", "t": "Freedom from Fear: The American People in Depression and War, 1929-1945 (Oxford History of the United States Book 9)", "a": "David M. Kennedy", "p": 992, "d": "Kennedy's combined Pulitzer-winning Oxford history of Depression and WWII.", "c": "History"},
  {"id": "B00F8CW0PI", "t": "Grand Expectations: The United States, 1945-1974 (Oxford History of the United States Book 10)", "a": "James T. Patterson", "p": 864, "d": "Patterson's Oxford history of postwar America 1945-1974.", "c": "History"},
  {"id": "B000QCSA0Y", "t": "Parting the Waters: America in the King Years 1954-63", "a": "Taylor Branch", "p": 1088, "d": "Branch's Pulitzer-winning first volume of his Martin Luther King Jr. trilogy.", "c": "History"},
  {"id": "1319115748", "t": "Palestine and the Arab-Israeli Conflict: A History with Documents", "a": "Charles Smith", "p": 528, "d": "Smith's textbook on the Israel-Palestine conflict with primary sources.", "c": "History"},
  {"id": "B07P85MP12", "t": "Turkey: A Modern History (Library of Modern Turkey Book 27)", "a": "Erik J. Zürcher", "p": 468, "d": "Zurcher's standard one-volume history of modern Turkey.", "c": "History"},
  {"id": "0571288014", "t": "A History of the Arab Peoples: Updated Edition", "a": "Albert Hourani", "p": 608, "d": "Hourani's classic synthetic history of Arab civilization.", "c": "History"},
  {"id": "019007406X", "t": "The Modern Middle East: A History", "a": "James L. Gelvin", "p": 656, "d": "Gelvin's textbook on the modern Middle East from the 18th century onward.", "c": "History"},
  {"id": "0691146179", "t": "A Brief History of the Late Ottoman Empire", "a": "M. Şükrü Hanioğlu", "p": 288, "d": "Hanioglu's compact academic history of the late Ottoman Empire.", "c": "History"},
  {"id": "0142437182", "t": "Siddhartha (Penguin Classics Deluxe Edition)", "a": "Hermann Hesse, Joachim Neugroschel", "p": 160, "d": "Hesse's spiritual novel in the Penguin Deluxe edition.", "c": "Classics"},
  {"id": "0465023975", "t": "Osman's Dream: The History of the Ottoman Empire", "a": "Caroline Finkel", "p": 704, "d": "Finkel's narrative history of six centuries of Ottoman rule.", "c": "History"},
  {"id": "1560258020", "t": "A Quiet Revolution: The First Palestinian Intifada and Nonviolent Resistance", "a": "Mary Elizabeth King, Jimmy Carter", "p": 256, "d": "King's history of Palestinian nonviolent resistance during the First Intifada.", "c": "History"},
  {"id": "B00309CNI0", "t": "The Middle East", "a": "Bernard Lewis", "p": null, "d": "Lewis's controversial collection of essays on Middle Eastern history.", "c": "History"},
  {"id": "0465098762", "t": "A History of Iran: Empire of the Mind", "a": "Michael Axworthy", "p": 368, "d": "Axworthy's compact history of Iran from antiquity to the Islamic Republic.", "c": "History"},
  {"id": "0520232623", "t": "Rule of Experts: Egypt, Techno-Politics, Modernity", "a": "Timothy Mitchell", "p": 336, "d": "Mitchell on the politics of expert knowledge in modern Egyptian state-building.", "c": "History"},
  {"id": "0691154414", "t": "Afghanistan: A Cultural and Political History (Princeton Studies in Muslim Politics)", "a": "Thomas J. Barfield", "p": 392, "d": "Barfield on Afghan tribal society and political history through 2010.", "c": "History"},
  {"id": "047018549X", "t": "All the Shah's Men: An American Coup and the Roots of Middle East Terror", "a": "Stephen Kinzer", "p": 272, "d": "Kinzer on the 1953 CIA-MI6 coup against Iran's Mosaddegh.", "c": "History"},
  {"id": "B086TZ58WW", "t": "The Bishop Murder Case", "a": "S.S. Van Dine", "p": null, "d": "Van Dine's 1929 Philo Vance whodunnit at a chess-themed murder spree.", "c": "Fiction"},
  {"id": "0307279480", "t": "Persian Fire: The First World Empire and the Battle for the West", "a": "Tom Holland", "p": 480, "d": "Holland on the Greco-Persian Wars and the rise of Persian imperialism.", "c": "History"},
  {"id": "0553384902", "t": "The Rise and Fall of Ancient Egypt", "a": "Toby Wilkinson", "p": 656, "d": "Wilkinson's narrative history of three thousand years of pharaonic civilization.", "c": "History"},
  {"id": "0801486300", "t": "The Twilight of Ancient Egypt: 1st Millennium B.C.", "a": "Karol Mysliwiec, David Lorton", "p": 240, "d": "Mysliwiec on Egypt during its Late Period from the 11th to 4th centuries BCE.", "c": "History"},
  {"id": "0500051399", "t": "The Tomb in Ancient Egypt", "a": "Aidan Dodson, Salima Ikram", "p": 240, "d": "Dodson and Ikram's illustrated overview of Egyptian funerary architecture.", "c": "History"},
  {"id": "0500050848", "t": "The Complete Pyramids: Solving the Ancient Mysteries", "a": "Mark Lehner", "p": 256, "d": "Lehner's authoritative illustrated guide to all the pyramids of Egypt.", "c": "History"},
  {"id": "B000FBJG86", "t": "The Bible Unearthed: Archaeology's New Vision of Ancient Israel and the Origin of Sacred Texts", "a": "Israel Finkelstein, Neil Asher Silberman", "p": 400, "d": "Finkelstein and Silberman's archaeological reassessment of biblical narratives.", "c": "History"},
  {"id": "0802863949", "t": "Did God Have a Wife?: Archaeology and Folk Religion in Ancient Israel", "a": "William G. Dever", "p": 368, "d": "Dever on archaeological evidence for popular Israelite religion and Asherah.", "c": "History"},
  {"id": "1845533410", "t": "Israel's History and the History of Israel (Bibleworld)", "a": "Mario Liverani", "p": 224, "d": "Liverani's historiographical analysis of how 'Israel's history' is constructed.", "c": "History"},
  {"id": "0567670430", "t": "Ancient Israel: What Do We Know and How Do We Know It?: Revised Edition", "a": "Lester L. Grabbe", "p": 272, "d": "Grabbe's textbook on the methodological problems of ancient Israelite history.", "c": "History"},
  {"id": "0802862608", "t": "Biblical History and Israel’s Past: The Changing Study of the Bible and History", "a": "Megan Bishop Moore, Brad E. Kelle", "p": 560, "d": "Moore and Kelle's history of Israel/biblical-history scholarship since 1970.", "c": "History"},
  {"id": "B000SQISYQ", "t": "The World of the Celts", "a": "Simon James", "p": 192, "d": "James's illustrated archaeological introduction to Iron Age Celtic culture.", "c": "History"},
  {"id": "0299166740", "t": "The Atlantic Celts: Ancient People Or Modern Invention?", "a": "Simon James", "p": 192, "d": "James argues 'Atlantic Celts' identity is a modern nationalist construction.", "c": "History"},
  {"id": "0520211405", "t": "Thundering Zeus: The Making of Hellenistic Bactria (Volume 32) (Hellenistic Culture and Society)", "a": "Frank L. Holt", "p": 264, "d": "Holt's history of the Hellenistic Greek kingdom of Bactria in Central Asia.", "c": "History"},
  {"id": "0520081838", "t": "From Samarkhand to Sardis: A New Approach to the Seleucid Empire (Hellenistic Culture and Society)", "a": "Susan Sherwin-White, Amélie Kuhrt", "p": 308, "d": "Sherwin-White and Kuhrt reframe the Seleucid Empire on Near Eastern terms.", "c": "History"},
  {"id": "0300164262", "t": "How Rome Fell: Death of a Superpower", "a": "Adrian Goldsworthy", "p": 560, "d": "Goldsworthy on the long internal decline of the Western Roman Empire.", "c": "History"},
  {"id": "B07SPHNW83", "t": "The Fires of Vesuvius: Pompeii Lost and Found", "a": "Mary Beard, Phyllida Nash", "p": 480, "d": "Beard's lively history of life in Pompeii up to its 79 CE destruction.", "c": "History"},
  {"id": "1400078970", "t": "Rubicon", "a": "Tom Holland", "p": 448, "d": "Holland's narrative history of the Roman Republic's last decades.", "c": "History"},
  {"id": "0520259920", "t": "Mediterranean Anarchy, Interstate War, and the Rise of Rome (Hellenistic Culture and Society) (Volume 48)", "a": "Arthur M. M. Eckstein", "p": 412, "d": "Eckstein applies international-relations theory to Rome's rise.", "c": "History"},
  {"id": "0192807285", "t": "The Fall of Rome: And the End of Civilization", "a": "Bryan Ward-Perkins", "p": 256, "d": "Ward-Perkins argues against the 'gentle transformation' view of Rome's fall.", "c": "History"},
  {"id": "0316511579", "t": "The Year 1000: What Life Was Like at the Turn of the First Millennium, An Englishman's World", "a": "Robert Lacey, Danny Danziger", "p": 240, "d": "Lacey and Danziger on daily life in late Anglo-Saxon England.", "c": "History"},
  {"id": "0500290512", "t": "The World of the Vikings", "a": "Richard Hall", "p": 240, "d": "Hall's illustrated guide to Viking-Age archaeology and culture.", "c": "History"},
  {"id": "B003C2SP6E", "t": "The Crusades: The Authoritative History of the War for the Holy Land", "a": "Thomas Asbridge", "p": 784, "d": "Asbridge's narrative history of the Crusades from 1095 to 1291.", "c": "History"},
  {"id": "B003UD7QIS", "t": "The Grand Strategy of the Byzantine Empire", "a": "Edward N. Luttwak", "p": 512, "d": "Luttwak applies modern strategic theory to Byzantine statecraft.", "c": "History"},
  {"id": "B016UEKRI4", "t": "Civilization of the Middle Ages: A Completely Revised and Expanded Edition—A Detailed and Lively Medieval History", "a": "Norman F. Cantor", "p": 640, "d": "Cantor's classic narrative history of medieval Europe.", "c": "History"},
  {"id": "B00HY0709S", "t": "Natasha's Dance: A Cultural History of Russia", "a": "Orlando Figes", "p": 768, "d": "Figes's cultural history of Russia through art, music, and literature.", "c": "History"},
  {"id": "0719515211", "t": "Origins of Modern Europe, 1660-1789", "a": "James L. White", "p": 260, "d": "White's textbook on early modern European history.", "c": "History"},
  {"id": "0375706364", "t": "Crucible of War: The Seven Years' War and the Fate of Empire in British North America, 1754-1766 (Vintage)", "a": "Fred Anderson", "p": 912, "d": "Anderson's history of the Seven Years' War in North America.", "c": "History"},
  {"id": "0198207344", "t": "The Dutch Republic: Its Rise, Greatness, and Fall 1477-1806 (Oxford History of Early Modern Europe)", "a": "Jonathan Israel", "p": 1264, "d": "Israel's massive history of the Dutch Republic across three centuries.", "c": "History"},
  {"id": "0137812604", "t": "The Rise of Modern Warfare: 1618-1815", "a": "H. W. Koch", "p": 288, "d": "Koch on military change from the Thirty Years' War to Napoleon.", "c": "History"},
  {"id": "0345298063", "t": "Peter the Great: His Life and World", "a": "Robert K. Massie", "p": 929, "d": "Massie's Pulitzer-winning biography of Russia's modernizing tsar.", "c": "History"},
  {"id": "B004J4X9L0", "t": "Catherine the Great: Portrait of a Woman", "a": "Robert K. Massie", "p": 656, "d": "Massie's biography of the German princess who became Russia's empress.", "c": "History"},
  {"id": "B004KPM23Y", "t": "Nicholas and Alexandra: The Classic Account of the Fall of the Romanov Dynasty", "a": "Robert K. Massie", "p": 672, "d": "Massie's classic narrative of Russia's last imperial family.", "c": "History"},
  {"id": "B0075WPKCY", "t": "The Romanovs: The Final Chapter", "a": "Robert K. Massie", "p": 336, "d": "Massie investigates the fate of the Romanov remains and Anastasia claims.", "c": "History"},
  {"id": "0300016476", "t": "Kievan Russia (The History of Russia Series)", "a": "George Vernadsky", "p": 412, "d": "Vernadsky's classic narrative history of pre-Mongol Russian principalities.", "c": "History"},
  {"id": "B01GX4QD1G", "t": "The Return of Martin Guerre", "a": "Natalie Zemon Davis", "p": 176, "d": "Davis's microhistory of the famous 16th-century French impostor case.", "c": "History"},
  {"id": "B00FBBME9S", "t": "The Cheese and the Worms: The Cosmos of a Sixteenth-Century Miller", "a": "Carlo Ginzburg, John Tedeschi", "p": 224, "d": "Ginzburg's classic microhistory of an Italian miller burned for heresy.", "c": "History"},
  {"id": "B000PC0SAA", "t": "Mayflower: A Story of Courage, Community, and War", "a": "Nathaniel Philbrick", "p": 480, "d": "Philbrick's narrative history of the Pilgrim landing and King Philip's War.", "c": "History"},
  {"id": "B000FA5UC8", "t": "Mayflower Bastard: A Stranger Among the Pilgrims", "a": "David Lindsay", "p": 272, "d": "Lindsay traces the descendants of an illegitimate Mayflower passenger.", "c": "History"},
  {"id": "B008CBDEFM", "t": "Savage Kingdom: Virginia and The Founding of English America (Text Only)", "a": "Benjamin Woolley", "p": 672, "d": "Woolley's history of the Jamestown colony's troubled early years.", "c": "History"},
  {"id": "B000OI1AG6", "t": "Big Chief Elizabeth: The Adventures and Fate of the First English Colonists in America", "a": "Giles Milton", "p": 304, "d": "Milton's narrative of the Roanoke colony and its enigmatic disappearance.", "c": "History"},
  {"id": "B000FCK2Z6", "t": "The Island at the Center of the World", "a": "Russell Shorto", "p": 400, "d": "Shorto on Dutch New Amsterdam and its influence on American culture.", "c": "History"},
  {"id": "B0013TX8S8", "t": "A Voyage Long and Strange: Rediscovering the New World", "a": "Tony Horwitz", "p": 480, "d": "Horwitz retraces the pre-Mayflower European explorations of North America.", "c": "History"},
  {"id": "0520042352", "t": "The Age of Reconnaissance: Discovery, Exploration, and Settlement, 1450-1650", "a": "J. H. Parry", "p": 456, "d": "Parry's classic synthesis of European voyages of discovery.", "c": "History"},
  {"id": "0674018281", "t": "China: A New History, Second Enlarged Edition", "a": "John King Fairbank, Merle Goldman", "p": 548, "d": "Fairbank and Goldman's standard one-volume history of China.", "c": "History"},
  {"id": "B017WQC7A0", "t": "The Search for Modern China by Jonathan D. Spence (1990-04-01)", "a": "", "p": null, "d": "Spence's standard textbook on Chinese history since the late Ming.", "c": "History"},
  {"id": "0521497817", "t": "A History of Chinese Civilization", "a": "Jacques Gernet, J. R. Foster", "p": 816, "d": "Gernet's standard one-volume history of Chinese civilization.", "c": "History"},
  {"id": "B003WE9C5A", "t": "China’s Cosmopolitan Empire: The Tang Dynasty (History of Imperial China Book 3)", "a": "Mark Edward Lewis, Timothy Brook", "p": 368, "d": "Lewis on the Tang Dynasty in Belknap's History of Imperial China series.", "c": "History"},
  {"id": "0520037677", "t": "As We Saw Them: The First Japanese Embassy to the United States, 1860", "a": "Masao Miyoshi", "p": 240, "d": "Miyoshi on the 1860 Japanese embassy and how its members saw America.", "c": "History"},
  {"id": "B00HXCHAQU", "t": "Civilization and Monsters: Spirits of Modernity in Meiji Japan (Asia-Pacific)", "a": "Gerald Figal", "p": 304, "d": "Figal on the place of the supernatural in Meiji-era Japan.", "c": "History"},
  {"id": "B000FCK206", "t": "Genghis Khan and the Making of the Modern World", "a": "Jack Weatherford", "p": 336, "d": "Weatherford on the lasting influence of the Mongol empire on the modern world.", "c": "History"},
  {"id": "B075FXGDDM", "t": "Modern South Asia: History, Culture, Political Economy", "a": "Sugata Bose, Ayesha Jalal", "p": 560, "d": "Bose and Jalal's textbook on South Asian history since 1700.", "c": "History"},
  {"id": "B000JMKVE4", "t": "1491 (Second Edition): New Revelations of the Americas Before Columbus", "a": "Charles C. Mann", "p": 560, "d": "Mann on pre-Columbian Americas as far more populous and developed than once thought.", "c": "History"},
  {"id": "B004G606EY", "t": "1493: Uncovering the New World Columbus Created", "a": "Charles C. Mann", "p": 560, "d": "Mann on the Columbian Exchange and the new world it created.", "c": "History"},
  {"id": "1314807978", "t": "The Case of the Cherokee Nation Against the State of Georgia: Argued and Determined at the Supreme Court of the United States, January Term 1831: With", "a": "Peters Richard 1780-1848", "p": null, "d": "Reprint of an 1831 Supreme Court reporter's account of Cherokee Nation v. Georgia.", "c": "History"},
  {"id": "0806121297", "t": "Custer Died for Your Sins: An Indian Manifesto", "a": "Jr. Vine Deloria", "p": 320, "d": "Deloria's classic 1969 polemic on Native American sovereignty and stereotypes.", "c": "History"},
  {"id": "0295981628", "t": "Landscape Traveled by Coyote and Crane: The World of the Schitsu'umsh (McLellan Endowed Series xx)", "a": "Rodney Frey", "p": 272, "d": "Frey's ethnography of the Coeur d'Alene people of the Inland Northwest.", "c": "History"},
  {"id": "0385239548", "t": "Trail of Tears: The Rise and Fall of the Cherokee Nation", "a": "John Ehle", "p": 432, "d": "Ehle's narrative history of Cherokee removal in the 1830s.", "c": "History"},
  {"id": "0393342921", "t": "A Most Dangerous Book: Tacitus's,from the Roman Empire to the Third Reich", "a": "Christopher B. Krebs", "p": 336, "d": "Krebs on the reception history of Tacitus's Germania, including by the Nazis.", "c": "History"},
  {"id": "0691000158", "t": "Buddhism in China: A Historical Survey", "a": "Kenneth Ch'en", "p": 560, "d": "Ch'en's classic survey of Chinese Buddhist history.", "c": "History"},
  {"id": "0060928832", "t": "From Dawn to Decadence: 1500 to the Present: 500 Years of Western Cultural Life", "a": "Jacques Barzun", "p": 912, "d": "Barzun's sweeping cultural history of the West since 1500.", "c": "History"},
  {"id": "081090408X", "t": "Pioneers of photography: An album of pictures and words", "a": "Aaron SCHARF", "p": 255, "d": "Scharf's illustrated history of nineteenth-century photography pioneers.", "c": "History"},
  {"id": "0810946424", "t": "Picture Machine: The Rise of American Newspictures", "a": "William Hannigan, Ken Johnston", "p": 224, "d": "Hannigan and Johnston's history of the news photography wire services.", "c": "History"},
  {"id": "1402714424", "t": "Hippie", "a": "Barry Miles", "p": 480, "d": "Miles's illustrated cultural history of the 1960s counterculture.", "c": "History"},
  {"id": "0520205081", "t": "Possessing Nature: Museums, Collecting, and Scientific Culture in Early Modern Italy (Studies on the History of Society and Culture) (Volume 20)", "a": "Paula Findlen", "p": 464, "d": "Findlen on early modern Italian collecting cabinets and natural history.", "c": "History"},
  {"id": "0195386108", "t": "Playboy and the Making of the Good Life in Modern America", "a": "Elizabeth Fraterrigo", "p": 336, "d": "Fraterrigo on Playboy magazine and postwar American masculinity.", "c": "History"},
  {"id": "0226670066", "t": "Bachelors and Bunnies: The Sexual Politics of Playboy", "a": "Carrie Pitzulo", "p": 240, "d": "Pitzulo on Playboy and the politics of midcentury American sexuality.", "c": "History"},
  {"id": "0393328732", "t": "The Last Expedition: Stanley's Mad Journey through the Congo", "a": "Daniel Liebowitz, Charles Pearson", "p": 320, "d": "Liebowitz on Stanley's disastrous Emin Pasha relief expedition.", "c": "History"},
  {"id": "B0018ND8B6", "t": "Over the Edge of the World: Magellan's Terrifying Circumnavigation of the Globe", "a": "Laurence Bergreen", "p": 480, "d": "Bergreen's narrative of Magellan's first circumnavigation.", "c": "History"},
  {"id": "080271529X", "t": "Longitude: The True Story of a Lone Genius Who Solved the Greatest Scientific Problem of His Time", "a": "Dava Sobel", "p": 200, "d": "Sobel on Harrison's marine chronometer and the longitude problem.", "c": "History"},
  {"id": "1409212297", "t": "The Worst Journey in the World", "a": "Apsley Cherry-Garrard", "p": 656, "d": "Cherry-Garrard's memoir of Scott's doomed Antarctic expedition.", "c": "History"},
  {"id": "0520245334", "t": "The History of Terrorism: From Antiquity to al Qaeda", "a": "Gérard Chaliand, Arnaud Blin", "p": 488, "d": "Chaliand's reference work on terrorism from antiquity to the present.", "c": "History"},
  {"id": "0765807998", "t": "A History of Terrorism", "a": "Walter Laqueur", "p": 310, "d": "Laqueur's classic comparative study of terrorism through the ages.", "c": "History"},
  {"id": "B0719PRJ89", "t": "Inside Terrorism (Columbia Studies in Terrorism and Irregular Warfare)", "a": "Bruce Hoffman", "p": 456, "d": "Hoffman's standard academic textbook on terrorism.", "c": "History"},
  {"id": "1400030846", "t": "The Looming Tower: Al-Qaeda and the Road to 9/11", "a": "Lawrence Wright", "p": 560, "d": "Wright's Pulitzer-winning history of al-Qaeda's road to 9/11.", "c": "History"},
  {"id": "0520241193", "t": "Bringing the War Home: The Weather Underground, the Red Army Faction, and Revolutionary Violence in the Sixties and Seventies", "a": "Jeremy Peter Varon", "p": 376, "d": "Varon on Weatherman, the RAF, and 1960s revolutionary violence.", "c": "History"},
  {"id": "0140144994", "t": "The Historical Figure of Jesus", "a": "E. P. Sanders", "p": 336, "d": "Sanders's reconstruction of the historical Jesus.", "c": "History"},
  {"id": "0060616296", "t": "The Historical Jesus: The Life of a Mediterranean Jewish Peasant", "a": "John Dominic Crossan", "p": 528, "d": "Crossan's reconstruction of Jesus as a Mediterranean Jewish peasant cynic.", "c": "History"},
  {"id": "0192854518", "t": "Paul: A Very Short Introduction", "a": "E. P. Sanders", "p": 192, "d": "Sanders's compact biography of Paul the Apostle.", "c": "History"},
  {"id": "B095T1153H", "t": "The Pasteurization of France", "a": "Bruno Latour, Alan Sheridan", "p": 288, "d": "Latour's STS classic on how Pasteur's microbes were socially produced.", "c": "History"},
  {"id": "0226750191", "t": "A Social History of Truth: Civility and Science in Seventeenth-Century England (Science and Its Conceptual Foundations series)", "a": "Steven Shapin", "p": 484, "d": "Shapin on how social trust shaped knowledge in Boyle's England.", "c": "History"},
  {"id": "0226045595", "t": "Galileo, Courtier: The Practice of Science in the Culture of Absolutism (Science and Its Conceptual Foundations series)", "a": "Mario Biagioli", "p": 438, "d": "Biagioli on Galileo's career as a courtier of the Medici.", "c": "History"},
  {"id": "189095179X", "t": "Objectivity (Mit Press)", "a": "Lorraine Daston, Peter L. Galison", "p": 501, "d": "Daston and Galison's history of objectivity as a scientific virtue.", "c": "History"},
  {"id": "B004EHZXVQ", "t": "A Tale of Two Cities", "a": "Charles Dickens", "p": 480, "d": "Dickens's French Revolution novel of resurrection and self-sacrifice.", "c": "Classics"},
  {"id": "B072R5754D", "t": "The Oxford Illustrated History of Science", "a": "Iwan Rhys Morus", "p": 656, "d": "Morus's illustrated Oxford history of science.", "c": "History"},
  {"id": "0195112296", "t": "The Oxford Companion to the History of Modern Science", "a": "John L. Heilbron", "p": 941, "d": "Heilbron's reference companion to modern science.", "c": "History"},
  {"id": "B000FC0UGW", "t": "The Snows of Kilimanjaro and Other Stories", "a": "Ernest Hemingway", "p": null, "d": "Hemingway's collected short stories including the title novella.", "c": "Classics"},
  {"id": "0198607822", "t": "SEMMENS:HOW STEAM LOCOMOTIVES REALLY WORK PAPER (Popular Science)", "a": "P. W. B. SEMMENS", "p": 160, "d": "Semmens's accessible illustrated explanation of steam locomotive operation.", "c": "Science"},
  {"id": "0192100246", "t": "Think: A Compelling Introduction to Philosophy", "a": "Simon Blackburn", "p": 320, "d": "Blackburn's accessible introduction to philosophical thinking.", "c": "Philosophy"},
  {"id": "0393624420", "t": "The Norton Introduction to Philosophy", "a": "Gideon Rosen, Alex Byrne", "p": 1568, "d": "Rosen and Byrne's anthology textbook for introductory philosophy.", "c": "Philosophy"},
  {"id": "126057069X", "t": "Critical Thinking", "a": "Brooke Noel Moore;Richard Parker", "p": 560, "d": "Moore and Parker's standard textbook on critical thinking.", "c": "Philosophy"},
  {"id": "1305958675", "t": "Ethics: Theory and Contemporary Issues (MindTap Course List)", "a": "Barbara MacKinnon, Andrew Fiala", "p": 608, "d": "MacKinnon and Fiala's textbook on ethical theory and applied issues.", "c": "Philosophy"},
  {"id": "1444335731", "t": "Ancient Greek Philosophy: From the Presocratics to the Hellenistic Philosophers", "a": "Thomas A. Blackson", "p": 720, "d": "Blackson's textbook on ancient Greek philosophy.", "c": "Philosophy"},
  {"id": "B00OZ4NOLO", "t": "A Presocratics Reader: Selected Fragments and Testimonia (Hackett Classics)", "a": "Patricia Curd, Richard D. McKirahan", "p": 240, "d": "Curd's anthology of pre-Socratic fragments and ancient testimonies.", "c": "Philosophy"},
  {"id": "0872203492", "t": "Plato: Complete Works", "a": "Plato, John M. Cooper", "p": 1838, "d": "Cooper's authoritative single-volume Plato.", "c": "Philosophy"},
  {"id": "0375757996", "t": "The Basic Works of Aristotle (Modern Library Classics)", "a": "Aristotle, Richard McKeon", "p": 1512, "d": "Modern Library edition of Aristotle's principal works.", "c": "Philosophy"},
  {"id": "0872203786", "t": "Hellenistic Philosophy (Hackett Classics)", "a": "Brad Inwood, Lloyd P. Gerson", "p": 476, "d": "Inwood and Gerson's anthology of Hellenistic-era philosophy in translation.", "c": "Philosophy"},
  {"id": "0205783899", "t": "Philosophic Classics, Volume III", "a": "Forrest Baird", "p": null, "d": "Baird's classic survey anthology of medieval philosophy.", "c": "Philosophy"},
  {"id": "041587923X", "t": "Epistemology: A Contemporary Introduction to the Theory of Knowledge, 3rd Edition", "a": "Robert Audi", "p": 368, "d": "Audi's standard introduction to contemporary epistemology.", "c": "Philosophy"},
  {"id": "1405169664", "t": "Epistemology: An Anthology (Blackwell Philosophy Anthologies)", "a": "Ernest Sosa, Jaekwon Kim", "p": 912, "d": "Sosa and Kim's anthology of analytic epistemology readings.", "c": "Philosophy"},
  {"id": "1138639346", "t": "Metaphysics (Routledge Contemporary Introductions to Philosophy)", "a": "Michael J. Loux", "p": 304, "d": "Loux's textbook on contemporary analytic metaphysics.", "c": "Philosophy"},
  {"id": "1444331027", "t": "Metaphysics: An Anthology (Blackwell Philosophy Anthologies)", "a": "Jaekwon Kim, Daniel Z. Korman", "p": 688, "d": "Kim and Korman's anthology of metaphysics readings.", "c": "Philosophy"},
  {"id": "0742564924", "t": "Moral Theory: An Introduction, Second Edition (Elements of Philosophy)", "a": "Mark Timmons", "p": 440, "d": "Timmons's textbook on normative ethical theory.", "c": "Philosophy"},
  {"id": "0470671602", "t": "Ethical Theory: An Anthology (Blackwell Philosophy Anthologies)", "a": "Russ Shafer-Landau", "p": 912, "d": "Shafer-Landau's anthology of ethical-theory readings.", "c": "Philosophy"},
  {"id": "087220605X", "t": "Utilitarianism", "a": "John Stuart Mill, George Sher", "p": 96, "d": "Mill's classic 1861 defense of utilitarian ethics.", "c": "Philosophy"},
  {"id": "B00OZ4NS4M", "t": "Grounding for the Metaphysics of Morals: with On a Supposed Right to Lie because of Philanthropic Concerns (Hackett Classics)", "a": "Immanuel Kant, James W. Ellington", "p": 96, "d": "Kant's compact masterpiece on autonomy and the categorical imperative.", "c": "Philosophy"},
  {"id": "1624668151", "t": "Nicomachean Ethics", "a": "Aristotle, Terence Irwin", "p": 320, "d": "Irwin's translation of Aristotle's foundational ethics with notes.", "c": "Philosophy"},
  {"id": "0199658013", "t": "An Introduction to Political Philosophy", "a": "Jonathan Wolff", "p": 256, "d": "Wolff's compact introduction to political philosophy.", "c": "Philosophy"},
  {"id": "0691159971", "t": "Princeton Readings in Political Thought: Essential Texts from Plato to Populism--Second Edition", "a": "Mitchell Cohen", "p": 832, "d": "Princeton anthology of Western political thought, second edition.", "c": "Philosophy"},
  {"id": "0078038413", "t": "The Logic Book", "a": "Merrie Bergmann, James Moor", "p": 744, "d": "Bergmann and Moor's textbook on symbolic logic.", "c": "Philosophy"},
  {"id": "0199575584", "t": "Logic for Philosophy", "a": "Theodore Sider", "p": 320, "d": "Sider's textbook bridging philosophical and formal logic.", "c": "Philosophy"},
  {"id": "0122384520", "t": "A Mathematical Introduction to Logic", "a": "Herbert B. Enderton", "p": 320, "d": "Enderton's standard textbook on first-order logic for math undergrads.", "c": "Mathematics"},
  {"id": "1138504580", "t": "Philosophy of Language: A Contemporary Introduction (Routledge Contemporary Introductions to Philosophy)", "a": "William G. Lycan", "p": 368, "d": "Lycan's textbook on theories of meaning and reference.", "c": "Philosophy"},
  {"id": "0199795150", "t": "The Philosophy of Language", "a": "A.P. Martinich, David Sosa", "p": 744, "d": "Martinich's anthology of major papers in the philosophy of language.", "c": "Philosophy"},
  {"id": "0813344581", "t": "Philosophy of Mind", "a": "Jaegwon Kim", "p": 336, "d": "Kim's standard introductory textbook on philosophy of mind.", "c": "Philosophy"},
  {"id": "0190640855", "t": "Philosophy of Mind: Classical and Contemporary Readings", "a": "David J. Chalmers", "p": 816, "d": "Chalmers's anthology of philosophy of mind readings.", "c": "Philosophy"},
  {"id": "0415221579", "t": "Understanding Philosophy of Science", "a": "James Ladyman", "p": 290, "d": "Ladyman's textbook on philosophy of science.", "c": "Philosophy"},
  {"id": "039391903X", "t": "Philosophy of Science: The Central Issues", "a": "Martin Curd, J. A. Cover", "p": 1408, "d": "Curd and Cover's anthology of philosophy of science readings.", "c": "Philosophy"},
  {"id": "B007USH7J2", "t": "The Structure of Scientific Revolutions: 50th Anniversary Edition", "a": "Thomas S. Kuhn, Ian Hacking", "p": 264, "d": "Kuhn's classic on paradigm shifts and scientific revolutions.", "c": "Philosophy"},
  {"id": "0192893068", "t": "Thinking about Mathematics: The Philosophy of Mathematics", "a": "Stewart Shapiro", "p": 336, "d": "Shapiro's textbook introduction to philosophy of mathematics.", "c": "Philosophy"},
  {"id": "0631195440", "t": "Philosophies of Mathematics", "a": "Alexander L. George, Daniel Velleman", "p": 290, "d": "George and Velleman's textbook on logicism, formalism, and intuitionism.", "c": "Philosophy"},
  {"id": "052129648X", "t": "Philosophy of Mathematics: Selected Readings (Volume 0)", "a": "Paul Benacerraf, Hilary Putnam", "p": 612, "d": "Benacerraf and Putnam's classic anthology of philosophy of math.", "c": "Philosophy"},
  {"id": "B00A44R3E8", "t": "On Formally Undecidable Propositions of Principia Mathematica and Related Systems (Dover Books on Mathematics)", "a": "Kurt Gödel", "p": 80, "d": "Godel's epoch-making 1931 incompleteness paper.", "c": "Mathematics"},
  {"id": "0814758371", "t": "Gödel's Proof", "a": "Ernest Nagel, James Newman", "p": 160, "d": "Nagel and Newman's accessible explanation of Godel's proof.", "c": "Philosophy"},
  {"id": "0415349796", "t": "Philosophy of the Arts: An Introduction to Aesthetics", "a": "Gordon Graham", "p": 304, "d": "Graham's textbook introduction to philosophical aesthetics.", "c": "Philosophy"},
  {"id": "0073407453", "t": "Biomedical Ethics", "a": "David DeGrazia, Thomas A. Mappes", "p": 792, "d": "DeGrazia and Mappes's textbook anthology of biomedical-ethics cases.", "c": "Philosophy"},
  {"id": "0415242096", "t": "Continental Philosophy: A Contemporary Introduction (Routledge Contemporary Introductions to Philosophy)", "a": "Andrew Cutrofello", "p": 312, "d": "Cutrofello's textbook on Continental philosophy.", "c": "Philosophy"},
  {"id": "0375759891", "t": "Basic Writings of Existentialism (Modern Library Classics)", "a": "Gordon Marino", "p": 480, "d": "Marino's anthology of existentialist primary readings.", "c": "Philosophy"},
  {"id": "0521718988", "t": "Mainstream and Formal Epistemology", "a": "Vincent F. Hendricks", "p": 256, "d": "Hendricks's bridge between traditional and formal epistemology.", "c": "Philosophy"},
  {"id": "0198752741", "t": "Medieval Philosophy (A New History of Western Philosophy, Vol. 2)", "a": "Anthony Kenny", "p": 336, "d": "Kenny's volume two of his history of Western philosophy: Augustine to Ockham.", "c": "Philosophy"},
  {"id": "0415894425", "t": "Metaethics (Routledge Contemporary Introductions to Philosophy)", "a": "Mark van Roojen", "p": 448, "d": "Van Roojen's textbook on metaethics.", "c": "Philosophy"},
  {"id": "0415126002", "t": "A New Introduction to Modal Logic", "a": "M.J. Cresswell, G.E. Hughes", "p": 440, "d": "Hughes and Cresswell's standard textbook on modal logic.", "c": "Philosophy"},
  {"id": "0691174679", "t": "Philosophy of Biology (Princeton Foundations of Contemporary Philosophy)", "a": "Peter Godfrey-Smith", "p": 200, "d": "Godfrey-Smith's compact textbook on philosophy of biology.", "c": "Philosophy"},
  {"id": "B00EVWK86E", "t": "Philosophy of Economics: A Contemporary Introduction (Routledge Contemporary Introductions to Philosophy)", "a": "Julian Reiss", "p": 400, "d": "Reiss's textbook on philosophical issues in economics.", "c": "Philosophy"},
  {"id": "1441141898", "t": "Philosophy of Law: Introducing Jurisprudence", "a": "Jeffrey Brand", "p": 272, "d": "Brand's textbook introduction to legal philosophy.", "c": "Philosophy"},
  {"id": "0495007250", "t": "Philosophy of Religion: An Introduction", "a": "William L. Rowe", "p": 240, "d": "Rowe's textbook on philosophy of religion.", "c": "Philosophy"},
  {"id": "0631225013", "t": "An Introduction to the Philosophy of Physics: Locality, Fields, Energy, and Mass", "a": "Marc Lange", "p": 332, "d": "Lange's textbook on philosophy of physics.", "c": "Philosophy"},
  {"id": "080483265X", "t": "I Am a Cat", "a": "Soseki Natsume, Aiko Ito", "p": 480, "d": "Soseki's modernist comic novel narrated by a sardonic feline.", "c": "Classics"},
  {"id": "B00M284NY2", "t": "Zero to One: Notes on Startups, or How to Build the Future", "a": "Peter Thiel, Blake Masters", "p": 224, "d": "Thiel and Masters on building monopoly tech startups.", "c": "Self-Help & Business"},
  {"id": "1925979024", "t": "The Useful Knots Book: How to Tie the 25+ Most Practical Rope Knots (Escape, Evasion, and Survival)", "a": "Sam Fury, Diana Mangoba", "p": null, "d": "Fury's pocket guide to twenty-five practical knots.", "c": "Self-Help & Business"},
  {"id": "0679731725", "t": "The Remains of the Day: Winner of the Nobel Prize in Literature", "a": "Kazuo Ishiguro", "p": 245, "d": "Ishiguro's Booker-winning novel of a dignified English butler's regret.", "c": "Classics"},
  {"id": "B07N7JRRSY", "t": "Mark Twain: The Complete Novels", "a": "Mark Twain", "p": null, "d": "Compilation of Mark Twain's complete novels for Kindle.", "c": "Classics"},
  {"id": "0817643176", "t": "102 Combinatorial Problems", "a": "Titu Andreescu, Zuming Feng", "p": 155, "d": "Andreescu and Feng's collection of olympiad combinatorics problems.", "c": "Mathematics"},
  {"id": "1568812795", "t": "generatingfunctionology", "a": "Herbert S. Wilf", "p": 228, "d": "Wilf's classic on generating functions in combinatorics.", "c": "Mathematics"},
  {"id": "1982159375", "t": "On Writing: A Memoir of the Craft (A Memoir of the Craft (Reissue))", "a": "Stephen King", "p": 320, "d": "King's craft memoir on the writing life.", "c": "Production"},
  {"id": "B00CIWZ8LE", "t": "Still Writing: The Perils and Pleasures of a Creative Life", "a": "Dani Shapiro", "p": 256, "d": "Shapiro's meditative essay collection on the writing life.", "c": "Production"},
  {"id": "B00BQ4NA1K", "t": "On Moral Fiction", "a": "John Gardner", "p": 224, "d": "Gardner's polemical defense of moral seriousness in fiction.", "c": "Production"},
  {"id": "B07KNSXXVS", "t": "First You Write a Sentence: The Elements of Reading, Writing . . . and Life", "a": "Joe Moran", "p": 256, "d": "Moran's writing-craft book on building elegant English sentences.", "c": "Production"},
  {"id": "B0042JSOTE", "t": "The Forest for the Trees (Revised and Updated): An Editor's Advice to Writers", "a": "Betsy Lerner", "p": 288, "d": "Lerner's editor's-eye memoir and writing-life advice.", "c": "Production"},
  {"id": "B000W93CNG", "t": "The Writing Life", "a": "Annie Dillard", "p": 128, "d": "Dillard's lyrical essays on the discipline and solitude of writing.", "c": "Production"},
  {"id": "B00H1UMOOM", "t": "Writing Past Dark: Envy, Fear, Distraction and Other Dilemmas in the Writer's Life", "a": "Bonnie Friedman", "p": 256, "d": "Friedman's essays on the psychological obstacles writers face.", "c": "Production"},
  {"id": "B09R25CXRD", "t": "The Elements of Style, Fourth Edition", "a": "William Strunk Jr., E. B. White", "p": 105, "d": "Strunk and White's classic prose-style manual.", "c": "Production"},
  {"id": "B0042FZVOY", "t": "Story: Style, Structure, Substance, and the Principles of Screenwriting", "a": "Robert McKee", "p": 480, "d": "McKee's screenwriting bible on story structure and craft.", "c": "Production"},
  {"id": "B004V3QUKQ", "t": "Making Shapely Fiction", "a": "Jerome Stern", "p": 272, "d": "Stern's brief writing-craft handbook on fiction shape and form.", "c": "Production"},
  {"id": "0933377460", "t": "Steering the Craft: Exercises and Discussions on Story Writing for the Lone Navigator or the Mutinous Crew", "a": "Ursula K. Le Guin", "p": 192, "d": "Le Guin's exercise-driven craft book on writing fiction.", "c": "Production"},
  {"id": "B000SEGI8Q", "t": "Bird by Bird: Some Instructions on Writing and Life", "a": "Anne Lamott", "p": 256, "d": "Lamott's beloved memoir-cum-craft book on writing and being human.", "c": "Production"},
  {"id": "1454926538", "t": "Bridgman's Complete Guide to Drawing From Life", "a": "George B. Bridgman", "p": 368, "d": "Bridgman's classic figure-drawing instruction in a single deluxe volume.", "c": "Art & Illustration"},
  {"id": "0486211045", "t": "Constructive Anatomy: Includes Nearly 500 Illustrations (Dover Anatomy for Artists)", "a": "George B. Bridgman", "p": 66, "d": "Bridgman's classic short manual on constructive figure drawing.", "c": "Art & Illustration"},
  {"id": "0486227081", "t": "Heads, Features and Faces (Dover Anatomy for Artists)", "a": "George B. Bridgman", "p": 60, "d": "Bridgman's short manual on drawing the human head and face.", "c": "Art & Illustration"},
  {"id": "048622709X", "t": "The Book of a Hundred Hands (Dover Anatomy for Artists)", "a": "George B. Bridgman", "p": 90, "d": "Bridgman's classic short manual on drawing the hand.", "c": "Art & Illustration"},
  {"id": "0857680986", "t": "Figure Drawing for All It's Worth", "a": "Andrew Loomis", "p": 208, "d": "Loomis's classic figure-drawing manual.", "c": "Art & Illustration"},
  {"id": "1845769287", "t": "Creative Illustration", "a": "Andrew Loomis", "p": 272, "d": "Loomis's classic textbook on commercial illustration.", "c": "Art & Illustration"},
  {"id": "0615272819", "t": "Figure Drawing: Design and Invention", "a": "Michael Hampton", "p": 160, "d": "Hampton's contemporary figure-drawing textbook.", "c": "Art & Illustration"},
  {"id": "0823015521", "t": "Dynamic Anatomy: Revised and Expanded Edition", "a": "Burne Hogarth", "p": 160, "d": "Hogarth's classic figure-drawing textbook.", "c": "Art & Illustration"},
  {"id": "0740785508", "t": "Imaginative Realism: How to Paint What Doesn't Exist (Volume 1) (James Gurney Art)", "a": "James Gurney", "p": 224, "d": "Gurney's manual on painting believable scenes from imagination.", "c": "Art & Illustration"},
  {"id": "0740797719", "t": "Color and Light: A Guide for the Realist Painter (Volume 2) (James Gurney Art)", "a": "James Gurney", "p": 224, "d": "Gurney's manual on color theory and natural lighting for painters.", "c": "Art & Illustration"},
  {"id": "096621174X", "t": "Alla Prima II Everything I Know about Painting--And More", "a": "Richard Schmid with Katie Swatland", "p": 200, "d": "Schmid's classic textbook on direct-painting (alla prima) technique.", "c": "Art & Illustration"},
  {"id": "1933492953", "t": "Framed Ink: Drawing and Composition for Visual Storytellers", "a": "Marcos Mateu-Mestre, Jeffrey Katzenberg", "p": 128, "d": "Mateu-Mestre's manual on cinematic composition for visual storytellers.", "c": "Art & Illustration"},
  {"id": "1624650538", "t": "Framed Ink 2: Frame Format, Energy, and Composition for Visual Storytellers", "a": "Marcos Mateu-Mestre", "p": 272, "d": "Mateu-Mestre's sequel on dynamic composition and energy in storyboards.", "c": "Art & Illustration"},
  {"id": "B01FGWLJ8S", "t": "Picture This: How Pictures Work", "a": "Molly Bang", "p": 96, "d": "Bang's compact analysis of how visual composition creates emotion.", "c": "Art & Illustration"},
  {"id": "1933492732", "t": "How to Draw: drawing and sketching objects and environments from your imagination", "a": "Scott Robertson, Thomas Bertling", "p": 208, "d": "Robertson's textbook on industrial design drawing technique.", "c": "Art & Illustration"},
  {"id": "1933492961", "t": "How to Render: the fundamentals of light, shadow and reflectivity", "a": "Scott Robertson, Thomas Bertling", "p": 208, "d": "Robertson's companion volume on rendering technique.", "c": "Art & Illustration"},
  {"id": "B003WMA7DS", "t": "The Practice and Science of Drawing (Fully Illustrated and Formatted for Kindle)", "a": "Harold Speed, Superior Formatting Publishing", "p": 272, "d": "Speed's classic 1913 manual on the principles of drawing.", "c": "Art & Illustration"},
  {"id": "B007C8NRSA", "t": "The Practicing Mind: Developing Focus and Discipline in Your Life Master Any Skill or Challenge by Learning to Love the Process", "a": "Thomas M. Sterner", "p": 160, "d": "Sterner's short book on cultivating present-focused practice.", "c": "Self-Help & Business"},
  {"id": "1585429201", "t": "Drawing on the Right Side of the Brain: The Definitive, 4th Edition", "a": "Betty Edwards", "p": 304, "d": "Edwards's classic on accessing right-brain perception for drawing.", "c": "Art & Illustration"},
  {"id": "1633228908", "t": "Cartoon Animation with Preston Blair, Revised Edition!: Learn techniques for drawing and animating cartoon characters (Collector's Series)", "a": "Preston Blair", "p": 224, "d": "Blair's classic Walter Foster cartoon-animation primer, revised.", "c": "Art & Illustration"},
  {"id": "1138669121", "t": "Acting for Animators: 4th Edition", "a": "Ed Hooks", "p": 272, "d": "Hooks's textbook on acting principles for animators.", "c": "Art & Illustration"},
  {"id": "0786860707", "t": "The Illusion of Life: Disney Animation", "a": "Ollie Johnston, Frank Thomas", "p": 576, "d": "Disney veterans Thomas and Johnston on classical character animation.", "c": "Art & Illustration"},
  {"id": "0367527758", "t": "Timing for Animation, 40th Anniversary Edition", "a": "Harold Whitaker, Tom Sito", "p": 160, "d": "Whitaker and Halas's classic short text on animation timing.", "c": "Art & Illustration"},
  {"id": "B01ELNNA0I", "t": "Character Animation Crash Course!", "a": "Eric Goldberg, Brad Bird", "p": 272, "d": "Goldberg's masterclass on character-animation principles.", "c": "Art & Illustration"},
  {"id": "B004AE3KTA", "t": "Frames of Anime", "a": "Tze-yue G. Hu", "p": 192, "d": "Hu's academic study of Japanese animation as a national medium.", "c": "Art & Illustration"},
  {"id": "1421561042", "t": "Starting Point, 1979-1996", "a": "Hayao Miyazaki, Beth Cary", "p": 464, "d": "Miyazaki's collected essays, interviews, and design notes.", "c": "Art & Illustration"},
  {"id": "0312784732", "t": "Talking Animals and Other People/the Autobiography of One of Animation's Legendary Figures", "a": "Shamus Culhane", "p": 430, "d": "Memoir of veteran Disney/Fleischer animator Shamus Culhane.", "c": "Art & Illustration"},
  {"id": "0847833542", "t": "The Making of Fantastic Mr. Fox", "a": "Wes Anderson", "p": 160, "d": "Behind-the-scenes book on Anderson's stop-motion adaptation.", "c": "Art & Illustration"},
  {"id": "1909414948", "t": "Beginner's Guide to Digital Painting in Photoshop 2nd Edition", "a": "3dtotal Publishing", "p": 288, "d": "3dtotal's beginner Photoshop digital-painting tutorial book.", "c": "Art & Illustration"},
  {"id": "160061020X", "t": "Bold Visions: A Digital Painting Bible: For Fantasy and Science Fiction Artists", "a": "Gary Tonge", "p": 208, "d": "Tonge's tutorial book on fantasy and sci-fi digital painting.", "c": "Art & Illustration"},
  {"id": "0240521749", "t": "Digital Painting Techniques: Practical Techniques of Digital Art Masters (Digital Art Masters Series)", "a": "3dtotal.Com", "p": 288, "d": "3dtotal's collected digital-painting workflow tutorials.", "c": "Art & Illustration"},
  {"id": "1624650201", "t": "Big Bad World of Concept Art for Video Games: An Insider's Guide for Students", "a": "Eliott J. Lilly", "p": 224, "d": "Lilly's career and craft guide for video-game concept artists.", "c": "Art & Illustration"},
  {"id": "1912843641", "t": "Beyond Art Fundamentals", "a": "3dtotal Publishing", "p": 296, "d": "3dtotal's advanced sequel to its art-fundamentals book.", "c": "Art & Illustration"},
  {"id": "1138956228", "t": "The Filmmaker's Guide to Visual Effects: The Art and Technique of VFX for Directors, Producers, Editors and Cinematographers *RISBN*", "a": "Eran Dinur", "p": 336, "d": "Dinur's accessible textbook on filmmaking with VFX.", "c": "Production"},
  {"id": "1138541176", "t": "The VES Handbook of Visual Effects: Industry Standard VFX Practices and Procedures", "a": "Jeffrey A. Okun VES, Susan Zwerman VES", "p": 1024, "d": "Industry-standard reference handbook for visual-effects production.", "c": "Production"},
  {"id": "0571211038", "t": "The Reel Truth: Everything You Didn't Know You Need to Know About Making an Independent Film", "a": "Reed Martin", "p": 256, "d": "Martin's practical guide to making indie films.", "c": "Production"},
  {"id": "0292776241", "t": "Sculpting in Time: Tarkovsky The Great Russian Filmaker Discusses His Art", "a": "Andrey Tarkovsky, Kitty Hunter-Blair", "p": 256, "d": "Tarkovsky's reflections on cinema as art.", "c": "Production"},
  {"id": "1615933204", "t": "The Total FilmMaker", "a": "Jerry Lewis, Maltin Leonard", "p": 480, "d": "Lewis's extensive how-to memoir on filmmaking craft.", "c": "Production"},
  {"id": "1879505622", "t": "In the Blink of an Eye: A Perspective on Film Editing, 2nd Edition", "a": "Walter Murch, Francis Ford Coppola", "p": 146, "d": "Murch's classic short essay on film editing.", "c": "Production"},
  {"id": "B01GI5F2FS", "t": "The Selfish Gene: 40th Anniversary edition (Oxford Landmark Science)", "a": "Richard Dawkins", "p": 496, "d": "Dawkins's classic on gene-centered evolutionary theory.", "c": "Science"},
  {"id": "B00F8CVT7I", "t": "Personality: What makes you the way you are (Oxford Landmark Science)", "a": "Daniel Nettle", "p": 256, "d": "Nettle's textbook on personality psychology.", "c": "Science"},
  {"id": "B001QEQRJW", "t": "Why Evolution Is True", "a": "Jerry A. Coyne", "p": 304, "d": "Coyne's accessible defense of evolution from the evidence.", "c": "Science"},
  {"id": "0199216819", "t": "The Oxford Book of Modern Science Writing (Oxford Landmark Science)", "a": "Richard Dawkins", "p": 419, "d": "Dawkins's anthology of great twentieth-century science writing.", "c": "Science"},
  {"id": "B005QMJ4ZO", "t": "The Planet in a Pebble: A journey into Earth's deep history (Oxford Landmark Science)", "a": "Jan Zalasiewicz", "p": 256, "d": "Zalasiewicz tells Earth's history through a single beach pebble.", "c": "Science"},
  {"id": "B004ZX3KQO", "t": "The Quantum Story: A history in 40 moments (Oxford Landmark Science)", "a": "Jim Baggott", "p": 480, "d": "Baggott's narrative history of quantum theory in forty episodes.", "c": "Science"},
  {"id": "B008RYSKKS", "t": "What is Life?: How Chemistry Becomes Biology (Oxford Landmark Science)", "a": "Addy Pross", "p": 288, "d": "Pross on the chemical origins of biological life.", "c": "Science"},
  {"id": "B074JCG4P9", "t": "The Emperor's New Mind: Concerning Computers, Minds, and the Laws of Physics (Oxford Landmark Science)", "a": "Roger Penrose", "p": 480, "d": "Penrose's argument that consciousness is non-algorithmic.", "c": "Science"},
  {"id": "B005EXD2T4", "t": "Gaia: A New Look at Life on Earth (Oxford Landmark Science)", "a": "James Lovelock", "p": 192, "d": "Lovelock's classic statement of the Gaia hypothesis.", "c": "Science"},
  {"id": "B00AAUBP3G", "t": "Oxygen: The molecule that made the world (Popular Science)", "a": "Nick Lane", "p": 384, "d": "Lane on oxygen as the engine of complex life.", "c": "Science"},
  {"id": "B01K2BLPN2", "t": "The Extended Phenotype: The Long Reach of the Gene (Oxford Landmark Science)", "a": "Richard Dawkins", "p": 336, "d": "Dawkins's gene's-eye-view book on phenotype as extended adaptation.", "c": "Science"},
  {"id": "B071L992Y5", "t": "The Emerald Planet: How plants changed Earth's history (Oxford Landmark Science)", "a": "David Beerling", "p": 288, "d": "Beerling on how plants drove climate change throughout Earth's history.", "c": "Science"},
  {"id": "B076DGM34N", "t": "Brainwashing: The science of thought control (Oxford Landmark Science)", "a": "Kathleen Taylor", "p": 336, "d": "Taylor on the science and practice of coercive persuasion.", "c": "Science"},
  {"id": "B077TVQV47", "t": "Deadly Companions: How Microbes Shaped our History (Oxford Landmark Science)", "a": "Dorothy H. Crawford", "p": 288, "d": "Crawford on infectious disease's role in human history.", "c": "Science"},
  {"id": "B077TQZMRG", "t": "Decoding Reality: The Universe as Quantum Information (Oxford Landmark Science)", "a": "Vlatko Vedral", "p": 256, "d": "Vedral on quantum information as the fundamental stuff of reality.", "c": "Science"},
  {"id": "B079ZXQ7H4", "t": "Hyperspace: A Scientific Odyssey through Parallel Universes, Time Warps, and the Tenth Dimension (Oxford Landmark Science)", "a": "Michio Kaku", "p": 368, "d": "Kaku's popular treatment of higher-dimensional physics.", "c": "Science"},
  {"id": "B07HCGHD8Q", "t": "Antimatter (Oxford Landmark Science)", "a": "Frank Close", "p": 224, "d": "Close's compact introduction to antimatter physics.", "c": "Science"},
  {"id": "B07JFDHRDQ", "t": "Power, Sex, Suicide: Mitochondria and the meaning of life (Oxford Landmark Science)", "a": "Nick Lane", "p": 368, "d": "Lane on mitochondria's outsized role in evolution and aging.", "c": "Science"},
  {"id": "B09J5GH2RB", "t": "Viruses: The Invisible Enemy (Oxford Landmark Science)", "a": "Dorothy H. Crawford", "p": 256, "d": "Crawford on viruses past, present, and future.", "c": "Science"},
  {"id": "1538105446", "t": "Complete Vocal Fitness: A Singer’s Guide to Physical Training, Anatomy, and Biomechanics", "a": "Claudia Friedlander", "p": 272, "d": "Friedlander's evidence-based vocal-training textbook.", "c": "Music"},
  {"id": "B003JBI0FO", "t": "THE BARITONE VOICE", "a": "Anthony Frisell, Adolph Caso", "p": 172, "d": "Frisell's classic technical text on baritone voice production.", "c": "Music"},
  {"id": "B003JH8AMG", "t": "THE SOPRANO VOICE", "a": "Anthony Frisell, Adolph Caso", "p": 215, "d": "Frisell's classic technical text on soprano voice production.", "c": "Music"},
  {"id": "157647240X", "t": "Practical Vocal Acoustics: Pedagogic Applications for Teachers and Singers (Vox Musicae: the Voice, Vocal Pedagogy, and Song)", "a": "Kenneth W. Bozeman", "p": 158, "d": "Bozeman's textbook on vocal acoustics for teachers and singers.", "c": "Music"},
  {"id": "0393330338", "t": "A Random Walk Down Wall Street: The Time-Tested Strategy for Successful Investing", "a": "Burton G. Malkiel", "p": 368, "d": "Malkiel's classic case for index investing.", "c": "Self-Help & Business"},
  {"id": "1529044197", "t": "The Complete Hitchhiker's Guide to the Galaxy Boxset: Guide to the Galaxy / The Restaurant at the End of the Universe / Life, the Universe and ... and Thanks for all the Fish / Mostly Harmless", "a": "Douglas Adams", "p": 816, "d": "Adams's complete five-novel Hitchhiker series boxed set.", "c": "Fiction"},
  {"id": "0679723161", "t": "Lolita", "a": "Vladimir Nabokov", "p": 336, "d": "Nabokov's controversial novel of Humbert Humbert and his obsession.", "c": "Classics"},
  {"id": "1840224886", "t": "Lady Chatterley's Lover (Wordsworth Classics)", "a": "D H Lawrence", "p": 320, "d": "Lawrence's once-banned novel of class and sexual transgression.", "c": "Classics"},
  {"id": "B000GCFBOC", "t": "CIRQUE DU SOLEIL (R) THE SPARK: Igniting the Creative Fire That Lives Within Us All", "a": "John U. Bacon, Lyn Heward", "p": 224, "d": "Heward's behind-the-scenes look at Cirque du Soleil's creative culture.", "c": "Self-Help & Business"},
  {"id": "B01NCYECGE", "t": "Challenges for Games Designers: Non-Digital Exercises for Video Game Designers", "a": "Brenda Brathwaite, Ian Schreiber", "p": 336, "d": "Brathwaite and Schreiber's tabletop exercise book for game-design students.", "c": "Game Design"},
  {"id": "B07J1T8P1W", "t": "A Pattern Language: Towns, Buildings, Construction (Center for Environmental Structure Series)", "a": "Christopher Alexander", "p": 1216, "d": "Alexander's classic taxonomy of architectural design patterns.", "c": "Game Design"},
  {"id": "B07VSC1K8Z", "t": "Write Great Code, Volume 1, 2nd Edition: Understanding the Machine", "a": "Randall Hyde", "p": 464, "d": "Hyde on machine architecture for software developers.", "c": "Programming & CS"},
  {"id": "B07WYV9P94", "t": "Write Great Code, Volume 2, 2nd Edition: Thinking Low-Level, Writing High-Level", "a": "Randall Hyde", "p": 656, "d": "Hyde on writing efficient HLL code with awareness of low-level effects.", "c": "Programming & CS"},
  {"id": "B07J4CST2Z", "t": "Write Great Code, Volume 3: Engineering Software", "a": "Randall Hyde", "p": 320, "d": "Hyde on the broader engineering practices of writing good code.", "c": "Programming & CS"},
  {"id": "0857680978", "t": "Drawing the Head and Hands", "a": "Andrew Loomis", "p": 160, "d": "Loomis's classic short manual on drawing heads and hands.", "c": "Art & Illustration"},
  {"id": "025207033X", "t": "Man, Play and Games", "a": "Roger Caillois", "p": 208, "d": "Caillois's classic 1958 sociology and typology of games.", "c": "Philosophy"},
  {"id": "B004W3FM4A", "t": "Finite and Infinite Games", "a": "James P. Carse", "p": 160, "d": "Carse's philosophical meditation on two kinds of games.", "c": "Philosophy"},
  {"id": "1554812151", "t": "The Grasshopper - Third Edition: Games, Life and Utopia", "a": "Bernard Suits, Frank Newfeld", "p": 256, "d": "Suits's playful philosophical defense of games as the ideal of existence.", "c": "Philosophy"},
  {"id": "B08XQYVZ55", "t": "What It Is", "a": "Lynda Barry", "p": 224, "d": "Barry's interactive comics-essay on creativity and memory.", "c": "Art & Illustration"},
  {"id": "1897299648", "t": "Picture This: The Near-sighted Monkey Book", "a": "Lynda Barry", "p": 240, "d": "Barry's hand-drawn manual on noticing and drawing the world.", "c": "Art & Illustration"},
  {"id": "1774641372", "t": "50 Secrets of Magic Craftsmanship", "a": "Salvador Dali, Haakon M Chevalier", "p": 192, "d": "Dali's eccentric advice book on artistic technique and life.", "c": "Art & Illustration"},
  {"id": "0618057072", "t": "The Origin of Consciousness in the Breakdown of the Bicameral Mind", "a": "Julian Jaynes", "p": 512, "d": "Jaynes's controversial theory of consciousness's recent emergence.", "c": "Science"},
  {"id": "B0024NP55G", "t": "Catching the Big Fish: Meditation, Consciousness, and Creativity: 10th Anniversary Edition", "a": "David Lynch", "p": 208, "d": "Lynch on transcendental meditation and creative practice.", "c": "Self-Help & Business"},
  {"id": "B004CFAWU2", "t": "Thinkertoys: A Handbook of Creative-Thinking Techniques", "a": "Michael Michalko", "p": 416, "d": "Michalko's compendium of creative-thinking exercises.", "c": "Self-Help & Business"},
  {"id": "0123740371", "t": "Sketching User Experiences: Getting the Design Right and the Right Design (Interactive Technologies)", "a": "Bill Buxton", "p": 446, "d": "Buxton's classic on sketching as a UX design tool.", "c": "Game Design"},
  {"id": "B005LDMOPA", "t": "Kobold Guide to Board Game Design (Kobold Guides to Game Design Book 4)", "a": "Richard Garfield, Steve Jackson", "p": 160, "d": "Anthology of essays on board-game design from Kobold Press.", "c": "Game Design"},
  {"id": "0131018167", "t": "Designing Virtual Worlds", "a": "Richard A. Bartle", "p": 768, "d": "Bartle's foundational textbook on virtual-world design.", "c": "Game Design"},
  {"id": "0367075253", "t": "Understanding Kids, Play, and Interactive Design: How to Create Games Children Love", "a": "Mark Schlichting", "p": 256, "d": "Schlichting on user-experience design for kids' interactive products.", "c": "Game Design"},
  {"id": "0061339202", "t": "Flow: The Psychology of Optimal Experience", "a": "Mihaly Csikszentmihalyi", "p": 320, "d": "Csikszentmihalyi's classic on the psychology of optimal experience.", "c": "Game Design"},
  {"id": "0313362246", "t": "Glued to Games: How Video Games Draw Us In and Hold Us Spellbound (New Directions in Media)", "a": "Scott Rigby, Richard Ryan", "p": 200, "d": "Rigby and Ryan apply self-determination theory to video games.", "c": "Game Design"},
  {"id": "132845052X", "t": "Punished By Rewards: Twenty-Fifth Anniversary Edition: The Trouble with Gold Stars, Incentive Plans, A's, Praise, and Other Bribes", "a": "Alfie Kohn", "p": 368, "d": "Kohn's classic critique of behavior-modification motivation.", "c": "Self-Help & Business"},
  {"id": "1119441285", "t": "Understanding Motivation and Emotion, Seventh Edition", "a": "Johnmarshall Reeve", "p": 560, "d": "Reeve's standard textbook on motivation and emotion.", "c": "Game Design"},
  {"id": "0192129988", "t": "Oxford History of Board Games", "a": "David Parlett", "p": 392, "d": "Parlett's reference history of board games worldwide.", "c": "Game Design"},
  {"id": "0262527537", "t": "Uncertainty in Games (Playful Thinking)", "a": "Greg Costikyan", "p": 152, "d": "Costikyan on randomness and uncertainty as design tools in games.", "c": "Game Design"},
  {"id": "B00383YJH6", "t": "The Unfinished Game: Pascal, Fermat, and the Seventeenth-Century Letter that Made the World Modern (Basic Ideas)", "a": "Keith Devlin", "p": 240, "d": "Devlin on the Pascal-Fermat correspondence that birthed probability.", "c": "Mathematics"},
  {"id": "B0048WQDIE", "t": "Catch-22: 50th Anniversary Edition", "a": "Joseph Heller, Christopher Buckley", "p": 560, "d": "Heller's classic anti-war satire of WWII airmen.", "c": "Classics"},
  {"id": "0684841258", "t": "God Knows", "a": "Joseph Heller", "p": 368, "d": "Heller's comic novel narrated by an aging King David.", "c": "Classics"},
  {"id": "0961392142", "t": "The Visual Display of Quantitative Information, 2nd Ed.", "a": "Edward R. Tufte", "p": 200, "d": "Tufte's classic on the design of statistical graphics.", "c": "Programming & CS"},
  {"id": "0486410870", "t": "Magic and Showmanship: A Handbook for Conjurers (Dover Magic Books)", "a": "Henning Nelms", "p": 320, "d": "Nelms's classic on the theatrical craft of magicians.", "c": "Art & Illustration"},
  {"id": "0367248999", "t": "Character Development and Storytelling for Games", "a": "Lee Sheldon", "p": 240, "d": "Sheldon's textbook on writing characters for video games.", "c": "Production"},
  {"id": "0240817176", "t": "Interactive Storytelling for Video Games: A Player-Centered Approach to Creating Memorable Characters and Stories", "a": "Josiah Lebowitz, Chris Klug", "p": 368, "d": "Lebowitz on player-centered storytelling in games.", "c": "Production"},
  {"id": "1615933158", "t": "The Writer's Journey - 25th Anniversary Edition: Mythic Structure for Writers", "a": "Christopher Vogler", "p": 448, "d": "Vogler's screenwriting application of Joseph Campbell's monomyth.", "c": "Production"},
  {"id": "1138341584", "t": "Digital Storytelling 4e: A creator's guide to interactive entertainment", "a": "Carolyn Handler Miller", "p": 504, "d": "Miller's textbook on transmedia and interactive storytelling.", "c": "Production"},
  {"id": "B07T7ZLD7F", "t": "Writing Fiction, Tenth Edition: A Guide to Narrative Craft", "a": "Janet Burroway, Elizabeth Stuckey-French", "p": null, "d": "Burroway's standard creative-writing textbook on fiction craft.", "c": "Production"},
  {"id": "B09XBDG9JV", "t": "Lord of the Flies", "a": "William Golding", "p": 224, "d": "Golding's parable of British schoolboys descending into savagery on a desert island.", "c": "Classics"},
  {"id": "1558609210", "t": "Better Game Characters by Design: A Psychological Approach", "a": "Katherine Isbister", "p": 376, "d": "Isbister's psychology-grounded textbook on game character design.", "c": "Game Design"},
  {"id": "0878301178", "t": "Impro: Improvisation and the Theatre", "a": "Keith Johnstone", "p": 208, "d": "Johnstone's classic textbook on theatrical improvisation.", "c": "Art & Illustration"},
  {"id": "006097625X", "t": "Understanding Comics: The Invisible Art", "a": "Scott McCloud", "p": 224, "d": "McCloud's seminal comics-form analysis told as comics.", "c": "Art & Illustration"},
  {"id": "B09H3FPXDP", "t": "The Timeless Way of Building", "a": "Christopher Alexander, Mike Fraser", "p": null, "d": "Alexander's foundational book on environmental design and pattern languages.", "c": "Game Design"},
  {"id": "0972652914", "t": "The Nature of Order: An Essay on the Art of Building and the Nature of the Universe, Book 1 - The Phenomenon of Life (Center for Environmental Structure, Vol. 9)", "a": "Christopher Alexander", "p": 476, "d": "Alexander's first volume on the principles of living architectural form.", "c": "Game Design"},
  {"id": "0972652922", "t": "The Process of Creating Life: Nature of Order, Book 2: An Essay on the Art of Building and the Nature of the Universe (The Nature of Order)(Flexible)", "a": "Christopher Alexander", "p": 672, "d": "Alexander on the design processes that produce living structure.", "c": "Game Design"},
  {"id": "0972652930", "t": "The Nature of Order: An Essay on the Art of Building and the Nature of the Universe, Book 3 - A Vision of a Living World (Center for Environmental Structure, Vol. 11)", "a": "Christopher Alexander", "p": 704, "d": "Alexander's third volume showing what living architecture looks like.", "c": "Game Design"},
  {"id": "0972652949", "t": "The Nature of Order: An Essay on the Art of Building and the Nature of the Universe, Book 4 - The Luminous Ground (Center for Environmental Structure, Vol. 12)", "a": "Christopher Alexander", "p": 368, "d": "Alexander's fourth volume on the metaphysics behind his theory.", "c": "Game Design"},
  {"id": "0321375971", "t": "Level Design for Games: Creating Compelling Game Experiences", "a": "Phil Co", "p": 368, "d": "Co's textbook on level design for video games.", "c": "Game Design"},
  {"id": "1594742774", "t": "The Art of the Video Game", "a": "Josh Jenisch", "p": 192, "d": "Jenisch's coffee-table survey of art in modern video games.", "c": "Game Design"},
  {"id": "159962110X", "t": "The Art of Video Games: From Pac-Man to Mass Effect", "a": "Chris Melissinos, Patrick O'Rourke", "p": 216, "d": "Melissinos's catalog from the Smithsonian video-game art exhibition.", "c": "Game Design"},
  {"id": "0201874849", "t": "Community Building on the Web : Secret Strategies for Successful Online Communities", "a": "Amy Jo Kim", "p": 380, "d": "Kim's classic textbook on online community design.", "c": "Game Design"},
  {"id": "1584500492", "t": "Game Programming Gems (GAME PROGRAMMING GEMS SERIES)", "a": "Mark DeLoura", "p": 614, "d": "First in the Game Programming Gems series of technical articles.", "c": "Game Design"},
  {"id": "1584500549", "t": "Game Programming Gems 2 (GAME PROGRAMMING GEMS SERIES)", "a": "Mark DeLoura", "p": 724, "d": "Game Programming Gems 2: rendering, AI, audio, networking, physics.", "c": "Game Design"},
  {"id": "1584502339", "t": "Game Programming GEMS 3 (GAME PROGRAMMING GEMS SERIES)", "a": "Dante Treglia", "p": 729, "d": "Game Programming Gems 3 with new techniques across all subsystems.", "c": "Game Design"},
  {"id": "1584502959", "t": "Game Programming Gems 4 (GAME PROGRAMMING GEMS SERIES)", "a": "Andrew Kirmse", "p": 688, "d": "Game Programming Gems 4: more practical real-time graphics and game tech.", "c": "Game Design"},
  {"id": "1584503521", "t": "Game Programming Gems 5 (GAME PROGRAMMING GEMS SERIES)", "a": "Kim Pallister", "p": 663, "d": "Game Programming Gems 5 with focus on next-gen platforms.", "c": "Game Design"},
  {"id": "1584504501", "t": "Game Programming Gems 6 (Book & CD-ROM)", "a": "Mike Dickheiser", "p": 720, "d": "Game Programming Gems 6 covering general programming, math, AI, graphics.", "c": "Game Design"},
  {"id": "1584505273", "t": "Game Programming Gems 7", "a": "Scott Jacobs", "p": 840, "d": "Game Programming Gems 7 with cutting-edge GPU and engine articles.", "c": "Game Design"},
  {"id": "1584507020", "t": "Game Programming Gems 8", "a": "Adam Lake", "p": 700, "d": "Game Programming Gems 8: final volume in the series.", "c": "Game Design"},
  {"id": "1466565969", "t": "Game AI Pro: Collected Wisdom of Game AI Professionals", "a": "Steven Rabin", "p": 628, "d": "Rabin's industry-tested anthology of game-AI techniques.", "c": "Game Design"},
  {"id": "1482254794", "t": "Game AI Pro 2: Collected Wisdom of Game AI Professionals", "a": "Steven Rabin", "p": 606, "d": "Rabin's second volume of game-AI articles from working developers.", "c": "Game Design"},
  {"id": "1498742580", "t": "Game AI Pro 3: Collected Wisdom of Game AI Professionals", "a": "Steve Rabin", "p": 488, "d": "Rabin's third Game AI Pro anthology.", "c": "Game Design"},
  {"id": "B006ORWT3Y", "t": "The Advantage: Why Organizational Health Trumps Everything Else In Business (J-B Lencioni Series)", "a": "Patrick M. Lencioni", "p": 240, "d": "Lencioni on organizational health as competitive advantage.", "c": "Self-Help & Business"},
  {"id": "1138098779", "t": "Game Design Workshop: A Playcentric Approach to Creating Innovative Games, Fourth Edition", "a": "Tracy Fullerton", "p": 520, "d": "Fullerton's textbook on iterative, prototype-driven game design.", "c": "Game Design"},
  {"id": "B003VIWRKY", "t": "Game Usability: Advancing the Player Experience", "a": "Katherine Isbister, Noah Schaffer", "p": 388, "d": "Isbister and Schaffer's textbook on game-usability testing.", "c": "Game Design"},
  {"id": "B012BLTM6I", "t": "The Innovator's Dilemma: When New Technologies Cause Great Firms to Fail (Management of Innovation and Change)", "a": "Clayton M. Christensen", "p": 336, "d": "Christensen's classic on disruptive innovation.", "c": "Self-Help & Business"},
  {"id": "B00E257S7C", "t": "The Innovator's Solution: Creating and Sustaining Successful Growth (Creating and Sustainability Successful Growth)", "a": "Clayton, Clayton M. Christensen", "p": 320, "d": "Christensen's sequel on how incumbents can disrupt themselves.", "c": "Self-Help & Business"},
  {"id": "B0024CEZR6", "t": "The 48 Laws of Power", "a": "Robert Greene, Joost Elffers", "p": 480, "d": "Greene's notorious anthology of historical power tactics.", "c": "Self-Help & Business"},
  {"id": "B00UVB3AMI", "t": "GPU Pro: Advanced Rendering Techniques", "a": "Wolfgang Engel", "p": 719, "d": "Engel's first GPU Pro anthology of advanced rendering articles.", "c": "Game Design"},
  {"id": "B008XMYV3O", "t": "GPU Pro 2", "a": "Wolfgang Engel", "p": 470, "d": "GPU Pro 2 with new GPU rendering techniques.", "c": "Game Design"},
  {"id": "B008RKMF76", "t": "GPU PRO 3: Advanced Rendering Techniques", "a": "Wolfgang Engel", "p": 430, "d": "GPU Pro 3 anthology of GPU rendering articles.", "c": "Game Design"},
  {"id": "B00CEN4RNW", "t": "GPU Pro 4: Advanced Rendering Techniques", "a": "Wolfgang Engel", "p": 502, "d": "GPU Pro 4 anthology.", "c": "Game Design"},
  {"id": "B00L2EBJAS", "t": "GPU Pro 5: Advanced Rendering Techniques", "a": "Wolfgang Engel", "p": 348, "d": "GPU Pro 5 anthology.", "c": "Game Design"},
  {"id": "B013FWJNFW", "t": "GPU Pro 6: Advanced Rendering Techniques", "a": "Wolfgang Engel", "p": 343, "d": "GPU Pro 6 anthology.", "c": "Game Design"},
  {"id": "B01DBMSN1Q", "t": "GPU Pro 7: Advanced Rendering Techniques", "a": "Wolfgang Engel", "p": 296, "d": "GPU Pro 7 anthology, the final GPU Pro volume.", "c": "Game Design"},
  {"id": "B0711SD1DW", "t": "GPU Zen: Advanced Rendering Techniques", "a": "Wolfgang Engel", "p": 360, "d": "Engel's first GPU Zen volume of advanced rendering articles.", "c": "Game Design"},
  {"id": "B07SYP7P6B", "t": "GPU Zen 2: Advanced Rendering Techniques", "a": "Wolfgang Engel", "p": 228, "d": "GPU Zen 2 anthology of advanced rendering.", "c": "Game Design"},
  {"id": "1430233516", "t": "Gamers at Work: Stories Behind the Games People Play", "a": "Morgan Ramsay, Peter Molyneux", "p": 280, "d": "Ramsay's interview book with successful game-studio founders.", "c": "Game Design"},
  {"id": "0992982901", "t": "The F2P Toolbox", "a": "Nicholas Lovell, Rob Fahey", "p": 300, "d": "Lovell's playbook on free-to-play game business models.", "c": "Game Design"},
  {"id": "0306808749", "t": "How I Made A Hundred Movies In Hollywood", "a": ". Corman", "p": 256, "d": "Corman's memoir on B-movie producing and Hollywood.", "c": "Production"},
  {"id": "B004G8Q1Q4", "t": "Reality Is Broken: Why Games Make Us Better and How They Can Change the World", "a": "Jane McGonigal", "p": 388, "d": "McGonigal on harnessing games to solve real-world problems.", "c": "Game Design"},
  {"id": "B00OFL6RDE", "t": "What Video Games Have to Teach Us About Learning and Literacy. Second Edition: Revised and Updated Edition", "a": "James Paul Gee", "p": 256, "d": "Gee's foundational text on games and learning.", "c": "Game Design"},
  {"id": "B00F0N74WO", "t": "New Traditional Games for Learning: A Case Book", "a": "Alex Moseley, Nicola Whitton", "p": 320, "d": "Moseley's case studies on educational uses of games.", "c": "Game Design"},
  {"id": "1138080802", "t": "Ten Steps to Complex Learning", "a": "Jeroen J. G. van Merriënboer, Paul A. Kirschner", "p": 412, "d": "Van Merrienboer's textbook on instructional design for complex skills.", "c": "Game Design"},
  {"id": "B00J9KUBRO", "t": "Digital Games and Learning: Research and Theory (Digital Games, Simulations, and Learning)", "a": "Nicola Whitton", "p": 208, "d": "Whitton's textbook on educational game design and research.", "c": "Game Design"},
  {"id": "0465036961", "t": "Killing Monsters: Why Children Need Fantasy, Super Heroes, and Make-Believe Violence", "a": "Gerard Jones, Lynn Ponton", "p": 272, "d": "Jones's defense of violent fantasy media for children's development.", "c": "Game Design"},
  {"id": "0609606131", "t": "Stop Teaching Our Kids to Kill : A Call to Action Against TV, Movie and Video Game Violence", "a": "Dave Grossman, Gloria Degaetano", "p": 208, "d": "Grossman's polemic against video-game violence and children.", "c": "Game Design"},
  {"id": "1138940925", "t": "Cinematography: Theory and Practice: Image Making for Cinematographers and Directors", "a": "Blain Brown", "p": 484, "d": "Brown's standard textbook on cinematography.", "c": "Production"},
  {"id": "0520053362", "t": "Masters of Light: Conversations with Contemporary Cinematographers", "a": "Dennis Schæfer, Larry Salvato", "p": 368, "d": "Schaefer's classic interview book with great cinematographers.", "c": "Production"},
  {"id": "0374201722", "t": "A Man With a Camera", "a": "Nestor ALMENDROS", "p": 291, "d": "Almendros's memoir on his cinematography career.", "c": "Production"},
  {"id": "1138780316", "t": "The Filmmaker's Eye: Learning (and Breaking) the Rules of Cinematic Composition", "a": "Gustavo Mercado", "p": 272, "d": "Mercado's textbook on shot composition and cinematic grammar.", "c": "Production"},
  {"id": "0821226231", "t": "Looking at Photographs: 100 Pictures from the Collection of The Museum of Modern Art", "a": "John Szarkowski, Museum of Modern Art", "p": 216, "d": "Szarkowski's classic intro photography book based on MoMA's collection.", "c": "Production"},
  {"id": "1584792795", "t": "How to Photograph Your Life: Capturing Everyday Moments with Your Camera and Your Heart", "a": "Nick Kelsh", "p": 160, "d": "Kelsh's beginner photography guide oriented toward family pictures.", "c": "Production"},
  {"id": "0393027678", "t": "In Our Time: The World As Seen by Magnum Photographers", "a": "American Federation of Arts, Eastman Kodak Company", "p": 480, "d": "Magnum collective's photographic chronicle of the postwar era.", "c": "Production"},
  {"id": "0470592125", "t": "Skin: The Complete Guide to Digitally Lighting, Photographing, and Retouching Faces and Bodies", "a": "Lee Varis, Rick Sammon", "p": 320, "d": "Varis's textbook on lighting and retouching skin in photography.", "c": "Production"},
  {"id": "0714867381", "t": "The Photography Book: 2nd Edition", "a": "Ian Jeffrey, Caroline Kinneberg", "p": 576, "d": "Phaidon's encyclopedic survey of important photographs.", "c": "Production"},
  {"id": "0893818755", "t": "Henri Cartier-Bresson: The Mind's Eye: Writings on Photography and Photographers", "a": "Henri Cartier-Bresson", "p": 160, "d": "Cartier-Bresson's collected writings on photography.", "c": "Production"},
  {"id": "0316373052", "t": "Black and White Photography: A Basic Manual Third Revised Edition", "a": "Henry Horenstein", "p": 288, "d": "Horenstein's standard B&W darkroom textbook.", "c": "Production"},
  {"id": "B074T8WHVJ", "t": "Best Business Practices for Photographers, Third Edition", "a": "John Harrington", "p": 608, "d": "Harrington's reference for working professional photographers.", "c": "Production"},
  {"id": "1603201270", "t": "LIFE Guide to Digital Photography: Everything You Need to Shoot Like the Pros", "a": "Joe McNally, Editors of Life", "p": 192, "d": "LIFE magazine's beginner-level digital-photography guide.", "c": "Production"},
  {"id": "0321670205", "t": "VisionMongers: Making a Life and a Living in Photography", "a": "David Duchemin", "p": 264, "d": "Duchemin on building a sustainable photography career.", "c": "Production"},
  {"id": "0312420099", "t": "On Photography", "a": "Susan Sontag", "p": 224, "d": "Sontag's classic 1977 essay collection on photography's meaning.", "c": "Production"},
  {"id": "0133988066", "t": "Scott Kelby's Digital Photography Set", "a": "Scott Kelby", "p": null, "d": "Kelby's bestselling collected practical photography guides.", "c": "Production"},
  {"id": "0375711570", "t": "Fundamentals of Photography: The Essential Handbook for Both Digital and Film Cameras", "a": "Tom Ang", "p": 352, "d": "Ang's photography textbook for beginning shooters.", "c": "Production"},
  {"id": "1454702435", "t": "Portrait Photography: Secrets of Posing & Lighting", "a": "Mark Cleghorn", "p": 160, "d": "Cleghorn's introductory book on portrait photography.", "c": "Production"},
  {"id": "B0010SEN18", "t": "Moment It Clicks, The: Photography secrets from one of the world's top shooters (Voices That Matter)", "a": "Joe McNally", "p": 240, "d": "McNally's career-spanning photography lessons.", "c": "Production"},
  {"id": "0321580141", "t": "The Hot Shoe Diaries: Big Light From Small Flashes", "a": "Joe McNally", "p": 304, "d": "McNally's behind-the-scenes book on his small-flash lighting work.", "c": "Production"},
  {"id": "032171105X", "t": "Speedliter's Handbook: Learning to Craft Light with Canon Speedlites", "a": "Syl Arena", "p": 288, "d": "Arena's textbook on Canon Speedlite small-flash photography.", "c": "Production"},
  {"id": "0367860260", "t": "Light ― Science & Magic: An Introduction to Photographic Lighting", "a": "Fil Hunter, Steven Biver", "p": 480, "d": "Hunter and Biver's classic textbook on photographic lighting principles.", "c": "Production"},
  {"id": "087070527X", "t": "The Photographer's Eye", "a": "John Szarkowski, Lee Friedlander", "p": 156, "d": "Szarkowski's elegant treatise on photographic seeing.", "c": "Production"},
  {"id": "0821221876", "t": "The Print (Ansel Adams Photography, 3)", "a": "Ansel Adams, Robert Baker", "p": 200, "d": "Adams's third Camera/Negative/Print volume on darkroom printing.", "c": "Production"},
  {"id": "0821221868", "t": "The Negative (Ansel Adams Photography, Series 2)", "a": "Ansel Adams, Robert Baker", "p": 272, "d": "Adams's classic on negative exposure and processing (Zone System).", "c": "Production"},
  {"id": "0821221841", "t": "Ansel Adams: The Camera (The Ansel Adams Photography Series 1)", "a": "Ansel Adams, Robert Baker", "p": 208, "d": "Adams's classic on the camera and basic exposure.", "c": "Production"},
  {"id": "B004JHYK88", "t": "Understanding Shutter Speed", "a": "Bryan Peterson", "p": 160, "d": "Peterson's beginner-friendly book on shutter-speed creativity.", "c": "Production"},
  {"id": "B0104EOJSK", "t": "Understanding Exposure, Fourth Edition: How to Shoot Great Photographs with Any Camera", "a": "Bryan Peterson", "p": 160, "d": "Peterson's bestselling beginner book on photographic exposure.", "c": "Production"},
  {"id": "B003V4BPG0", "t": "Fer-de-Lance (A Nero Wolfe Mystery Book 1)", "a": "Rex Stout", "p": 288, "d": "First Nero Wolfe novel: Wolfe's debut investigates a poisoned golfer.", "c": "Fiction"},
  {"id": "B003IYI6X8", "t": "The League of Frightened Men (A Nero Wolfe Mystery Book 2)", "a": "Rex Stout", "p": 272, "d": "Second Wolfe novel: a club's bizarre suspicions and a murderer's revenge.", "c": "Fiction"},
  {"id": "B00413QACE", "t": "The Rubber Band (A Nero Wolfe Mystery Book 3)", "a": "Rex Stout", "p": 256, "d": "Third Wolfe novel: a missing fortune and a revenge plot from the Old West.", "c": "Fiction"},
  {"id": "B004SOQ076", "t": "The Red Box (A Nero Wolfe Mystery Book 4)", "a": "Rex Stout", "p": 240, "d": "Fourth Wolfe novel: a poisoned candy-box and a fashion-house intrigue.", "c": "Fiction"},
  {"id": "B003V4BPTC", "t": "Too Many Cooks (A Nero Wolfe Mystery Book 5)", "a": "Rex Stout", "p": 288, "d": "Fifth Wolfe novel: a chefs' convention and a Saucisse Minuit murder.", "c": "Fiction"},
  {"id": "B00413QAD8", "t": "Some Buried Caesar (A Nero Wolfe Mystery Book 6)", "a": "Rex Stout", "p": 272, "d": "Sixth Wolfe novel: an upstate cattle show and a contested prize bull.", "c": "Fiction"},
  {"id": "B003V4BP3I", "t": "Over My Dead Body (A Nero Wolfe Mystery Book 7)", "a": "Rex Stout", "p": 256, "d": "Seventh Wolfe novel: a woman claiming to be Wolfe's daughter is murdered.", "c": "Fiction"},
  {"id": "B003M68TIE", "t": "Where There's a Will (A Nero Wolfe Mystery Book 8)", "a": "Rex Stout", "p": 256, "d": "Eighth Wolfe novel: a dying woman's will sends Wolfe and Archie chasing legacies.", "c": "Fiction"},
  {"id": "B003T0G9HG", "t": "Black Orchids (A Nero Wolfe Mystery Book 9)", "a": "Rex Stout, Lawrence Block", "p": 272, "d": "Ninth: two novellas including the famous Black Orchids fanciers' showdown.", "c": "Fiction"},
  {"id": "B003M5IUSY", "t": "Not Quite Dead Enough (A Nero Wolfe Mystery Book 10)", "a": "Rex Stout", "p": 320, "d": "Tenth Wolfe: novellas set during Wolfe's WWII Army stint.", "c": "Fiction"},
  {"id": "B004J4X9G0", "t": "The Silent Speaker (A Nero Wolfe Mystery Book 11)", "a": "Rex Stout", "p": 320, "d": "Eleventh: Wolfe ventures into the National Industrial Association murder.", "c": "Fiction"},
  {"id": "B004SOQ0A8", "t": "Too Many Women (A Nero Wolfe Mystery Book 12)", "a": "Rex Stout", "p": 304, "d": "Twelfth Wolfe: dating-bureau employees keep dying conveniently.", "c": "Fiction"},
  {"id": "B004J4XGHC", "t": "And Be a Villain (A Nero Wolfe Mystery Book 13)", "a": "Rex Stout", "p": 288, "d": "Thirteenth Wolfe: a radio-show poisoning live on the air.", "c": "Fiction"},
  {"id": "B003L1ZWRG", "t": "Trouble in Triplicate (A Nero Wolfe Mystery Book 14)", "a": "Rex Stout", "p": 288, "d": "Fourteenth Wolfe: three novellas of war-era cases.", "c": "Fiction"},
  {"id": "B003M5IUTS", "t": "The Second Confession (A Nero Wolfe Mystery Book 15)", "a": "Rex Stout", "p": 288, "d": "Fifteenth Wolfe: a Communist label and an upstate weekend murder.", "c": "Fiction"},
  {"id": "B003O86QAS", "t": "Three Doors to Death (A Nero Wolfe Mystery Book 16)", "a": "Rex Stout", "p": 288, "d": "Sixteenth Wolfe: three novellas including a flower-show case.", "c": "Fiction"},
  {"id": "B003V4BPVK", "t": "In the Best Families (A Nero Wolfe Mystery Book 17)", "a": "Rex Stout", "p": 288, "d": "Seventeenth Wolfe: a master criminal frames Wolfe and Archie.", "c": "Fiction"},
  {"id": "B003JMFP1K", "t": "Curtains for Three (A Nero Wolfe Mystery Book 18)", "a": "Rex Stout", "p": 272, "d": "Eighteenth Wolfe: three novellas including the curtain-call killing.", "c": "Fiction"},
  {"id": "B003JPW0E2", "t": "Murder by the Book (A Nero Wolfe Mystery 19)", "a": "Rex Stout", "p": 304, "d": "Nineteenth Wolfe: a writer's manuscript and a deadly publishing world.", "c": "Fiction"},
  {"id": "B003IYI6XS", "t": "Triple Jeopardy (A Nero Wolfe Mystery Book 20)", "a": "Rex Stout", "p": 288, "d": "Twentieth Wolfe: three novellas including a tax-related murder.", "c": "Fiction"},
  {"id": "B003O86QAI", "t": "Prisoner's Base (A Nero Wolfe Mystery Book 21)", "a": "Rex Stout", "p": 272, "d": "Twenty-first Wolfe: a fugitive's young niece comes to Wolfe for shelter.", "c": "Fiction"},
  {"id": "B003N9AZIM", "t": "The Golden Spiders (A Nero Wolfe Mystery Book 22)", "a": "Rex Stout", "p": 240, "d": "Twenty-second Wolfe: a boy ends up dead after warning of murder.", "c": "Fiction"},
  {"id": "B004SOQ1GG", "t": "Three Men Out (A Nero Wolfe Mystery Book 23)", "a": "Rex Stout", "p": 272, "d": "Twenty-third Wolfe: three novellas of varied detective ingenuity.", "c": "Fiction"},
  {"id": "B004SOQ1XY", "t": "The Black Mountain (A Nero Wolfe Mystery Book 24)", "a": "Rex Stout", "p": 272, "d": "Twenty-fourth Wolfe: Marko Vukcic's murder takes Wolfe behind the Iron Curtain.", "c": "Fiction"},
  {"id": "B003L1ZWQW", "t": "Before Midnight (A Nero Wolfe Mystery Book 25)", "a": "Rex Stout", "p": 288, "d": "Twenty-fifth Wolfe: a perfume contest and a body in the Strand.", "c": "Fiction"},
  {"id": "B003O86QB2", "t": "Three Witnesses (A Nero Wolfe Mystery Book 26)", "a": "Rex Stout", "p": 272, "d": "Twenty-sixth Wolfe: three novellas of clever short-form puzzles.", "c": "Fiction"},
  {"id": "B003IYI6YC", "t": "Might As Well Be Dead (A Nero Wolfe Mystery Book 27)", "a": "Rex Stout", "p": 256, "d": "Twenty-seventh Wolfe: a wrongly convicted man's nephew was right.", "c": "Fiction"},
  {"id": "B003M5IUT8", "t": "Three for the Chair (A Nero Wolfe Mystery Book 28)", "a": "Rex Stout", "p": 272, "d": "Twenty-eighth Wolfe: three novellas of metropolitan murders.", "c": "Fiction"},
  {"id": "B003JMFP10", "t": "If Death Ever Slept (A Nero Wolfe Mystery Book 29)", "a": "Rex Stout", "p": 272, "d": "Twenty-ninth Wolfe: an industrialist's daughter and a bedroom murder.", "c": "Fiction"},
  {"id": "B003V4BPOC", "t": "And Four to Go (A Nero Wolfe Mystery Book 30)", "a": "Rex Stout", "p": 272, "d": "Thirtieth Wolfe: four novellas including a holiday-themed mystery.", "c": "Fiction"},
  {"id": "B003V4BPP6", "t": "Champagne for One (A Nero Wolfe Mystery Book 31)", "a": "Rex Stout", "p": 272, "d": "Thirty-first Wolfe: champagne-spiked-with-cyanide at a coming-out party.", "c": "Fiction"},
  {"id": "B004SOQ11G", "t": "Plot It Yourself (A Nero Wolfe Mystery Book 32)", "a": "Rex Stout", "p": 256, "d": "Thirty-second Wolfe: a literary plagiarism leads to multiple murders.", "c": "Fiction"},
  {"id": "B003O86QCG", "t": "Three at Wolfe's Door (A Nero Wolfe Mystery Book 33)", "a": "Rex Stout, Margaret Maron", "p": 272, "d": "Thirty-third Wolfe: three novellas including the title party-host case.", "c": "Fiction"},
  {"id": "B004SOQ1PM", "t": "Too Many Clients (A Nero Wolfe Mystery Book 34)", "a": "Rex Stout", "p": 240, "d": "Thirty-fourth Wolfe: an architect's love-nest tenant problem.", "c": "Fiction"},
  {"id": "B003IYI6Z6", "t": "The Final Deduction (A Nero Wolfe Mystery Book 35)", "a": "Rex Stout", "p": 256, "d": "Thirty-fifth Wolfe: an heiress's kidnapping and ransom puzzle.", "c": "Fiction"},
  {"id": "B003TSEKG0", "t": "Homicide Trinity (A Nero Wolfe Mystery Book 36)", "a": "Rex Stout", "p": 240, "d": "Thirty-sixth Wolfe: three novellas of Manhattan murder.", "c": "Fiction"},
  {"id": "B004SOQ0JY", "t": "Gambit (A Nero Wolfe Mystery Book 37)", "a": "Rex Stout", "p": 240, "d": "Thirty-seventh Wolfe: a chess-playing exhibitionist meets a poisoned king.", "c": "Fiction"},
  {"id": "B003PJ7G50", "t": "The Mother Hunt (A Nero Wolfe Mystery Book 38)", "a": "Rex Stout, Marilyn Wallace", "p": 256, "d": "Thirty-eighth Wolfe: a missing baby and a mother in hiding.", "c": "Fiction"},
  {"id": "B003V4BPSI", "t": "Trio for Blunt Instruments (A Nero Wolfe Mystery Book 39)", "a": "Rex Stout", "p": 240, "d": "Thirty-ninth Wolfe: three novellas of varied mysteries.", "c": "Fiction"},
  {"id": "B003M5IUTI", "t": "A Right to Die (A Nero Wolfe Mystery Book 40)", "a": "Rex Stout", "p": 240, "d": "Fortieth Wolfe: a Black civil-rights leader's murder.", "c": "Fiction"},
  {"id": "B003O86QA8", "t": "The Doorbell Rang (A Nero Wolfe Mystery Book 41)", "a": "Rex Stout, Stuart M. Kaminsky", "p": 256, "d": "Forty-first Wolfe: Wolfe takes on the FBI itself.", "c": "Fiction"},
  {"id": "B003V4BPLK", "t": "Death of a Doxy (A Nero Wolfe Mystery Book 42)", "a": "Rex Stout", "p": 240, "d": "Forty-second Wolfe: a high-class call girl is murdered.", "c": "Fiction"},
  {"id": "B003M68TIO", "t": "The Father Hunt (A Nero Wolfe Mystery Book 43)", "a": "Rex Stout", "p": 240, "d": "Forty-third Wolfe: a paternity puzzle linked to murder.", "c": "Fiction"},
  {"id": "B003JMFP24", "t": "Death of a Dude (A Nero Wolfe Mystery Book 44)", "a": "Rex Stout", "p": 240, "d": "Forty-fourth Wolfe: Lily Rowan's Montana ranch and a hired-hand killing.", "c": "Fiction"},
  {"id": "B003V4BPUQ", "t": "Please Pass The Guilt (A Nero Wolfe Mystery Book 45)", "a": "Rex Stout", "p": 240, "d": "Forty-fifth Wolfe: a TNT-laced desk drawer in an ad agency.", "c": "Fiction"},
  {"id": "B004SOQ0GC", "t": "Family Affair (A Nero Wolfe Mystery Book 46)", "a": "Rex Stout", "p": 256, "d": "Forty-sixth Wolfe: a New Year's Eve waiter's death pulls Wolfe in.", "c": "Fiction"},
  {"id": "B003IYI6Y2", "t": "Death Times Three (A Nero Wolfe Mystery Book 47)", "a": "Rex Stout", "p": 224, "d": "Forty-seventh: three novellas posthumously assembled.", "c": "Fiction"},
  {"id": "8175994312", "t": "Complete Novel of Sherlock Holmes - Classics , The", "a": "Sir Arthur Conan Doyle", "p": 1392, "d": "Doyle's complete Sherlock Holmes novels and short stories.", "c": "Fiction"},
  {"id": "0393325423", "t": "Six Degrees: The Science of a Connected Age", "a": "Duncan J. Watts", "p": 368, "d": "Watts's classic on small-world networks and connectedness.", "c": "Science"},
  {"id": "B008EHSF8A", "t": "The MIPS Programmer's Handbook (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Erin Farquhar, Philip J. Bunce", "p": null, "d": "Farquhar's reference for MIPS assembly programmers.", "c": "Programming & CS"},
  {"id": "B0029ZAD0G", "t": "Cache Memory Book, The (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Jim Handy", "p": null, "d": "Handy's reference on CPU cache memory design.", "c": "Programming & CS"},
  {"id": "B004JF5QRO", "t": "Parallel Computer Architecture: A Hardware/Software Approach (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "David Culler, Jaswinder Pal Singh", "p": 1056, "d": "Culler's textbook on parallel computer architecture.", "c": "Programming & CS"},
  {"id": "B00AAPRHE2", "t": "Logical Effort: Designing Fast CMOS Circuits (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Ivan Sutherland, Robert F. Sproull", "p": null, "d": "Sutherland's compact textbook on logical-effort circuit-design method.", "c": "Programming & CS"},
  {"id": "B00CLC3VBU", "t": "Skew-Tolerant Circuit Design (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "David Harris", "p": null, "d": "Harris on skew-tolerant clocking strategies in VLSI.", "c": "Programming & CS"},
  {"id": "B00BCRB7J8", "t": "Interconnection Networks (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Jose Duato, Sudhakar Yalamanchili", "p": 608, "d": "Duato's classic textbook on interconnection-network design.", "c": "Programming & CS"},
  {"id": "B001F7BD3K", "t": "Network Processor Design: Issues and Practices (The Morgan Kaufmann Series in Computer Architecture and Design Book 1)", "a": "Mark A. Franklin, Patrick Crowley", "p": null, "d": "Franklin's textbook on packet-processing network-processor design.", "c": "Programming & CS"},
  {"id": "B001CHXIYK", "t": "The Grid 2: Blueprint for a New Computing Infrastructure (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Ian Foster, Carl Kesselman", "p": 748, "d": "Foster and Kesselman's edited volume on grid computing.", "c": "Programming & CS"},
  {"id": "B001V7U76I", "t": "Principles and Practices of Interconnection Networks (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "William James Dally, Brian Patrick Towles", "p": 550, "d": "Dally's standard textbook on interconnection networks.", "c": "Programming & CS"},
  {"id": "B006QV1AC4", "t": "ARM System Developer's Guide: Designing and Optimizing System Software (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Andrew Sloss, Dominic Symes", "p": 689, "d": "Sloss's textbook on ARM-based system software.", "c": "Programming & CS"},
  {"id": "B006NV2EO0", "t": "Virtual Machines: Versatile Platforms for Systems and Processes (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Jim Smith, Ravi Nair", "p": 656, "d": "Smith and Nair's textbook on virtual machines and abstraction layers.", "c": "Programming & CS"},
  {"id": "B001D212JC", "t": "Customizable Embedded Processors: Design Technologies and Applications (The Morgan Kaufmann Series in Computer Architecture and Design) (Volume)", "a": "Paolo Ienne, Rainer Leupers", "p": 550, "d": "Ienne's textbook on application-specific embedded processor design.", "c": "Programming & CS"},
  {"id": "B00BMEWT6G", "t": "See MIPS Run (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Dominic Sweetman", "p": 488, "d": "Sweetman's classic on how MIPS processors work.", "c": "Programming & CS"},
  {"id": "B004KA9UY8", "t": "Architecture of Network Systems (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Dimitrios Serpanos, Tilman Wolf", "p": 336, "d": "Serpanos's textbook on network-systems architecture.", "c": "Programming & CS"},
  {"id": "B006FG1HNM", "t": "Computer Organization and Design: The Hardware/Software Interface (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "David A. Patterson, John L. Hennessy", "p": 914, "d": "Patterson and Hennessy's classic CompArch textbook.", "c": "Programming & CS"},
  {"id": "B01DRXDMZG", "t": "An Introduction to Direct Access Storage Devices (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Hugh M. Sierra", "p": 332, "d": "Sierra on disk-storage device basics.", "c": "Programming & CS"},
  {"id": "B01H5GQGN6", "t": "The System Engineers Handbook: Guide to Building VME and VXI Systems (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "John Black", "p": null, "d": "Black's reference on VME/VXI instrumentation systems.", "c": "Programming & CS"},
  {"id": "B08QRX7412", "t": "Computer Organization and Design MIPS Edition: The Hardware/Software Interface (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "David A. Patterson, John L. Hennessy", "p": 700, "d": "Updated MIPS edition of Patterson and Hennessy's classic textbook.", "c": "Programming & CS"},
  {"id": "B008N6XV2W", "t": "Cache and Memory Hierarchy Design: A Performance Directed Approach (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Steven A. Przybylski", "p": 213, "d": "Przybylski on cache and memory hierarchy performance.", "c": "Programming & CS"},
  {"id": "B008HNGZRO", "t": "Computing Perspectives (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Maurice V. Wilkes", "p": 272, "d": "Wilkes's collected essays on the history of computing.", "c": "Programming & CS"},
  {"id": "B01H1DCRRC", "t": "Computer Organization and Design ARM Edition: The Hardware Software Interface (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "David A. Patterson, John L. Hennessy", "p": 700, "d": "ARM edition of Patterson and Hennessy's CompArch textbook.", "c": "Programming & CS"},
  {"id": "B01LWJD6EC", "t": "Computers as Components: Principles of Embedded Computing System Design (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "Marilyn Wolf Ph.D., Electrical Engineering, Stanford University", "p": 528, "d": "Wolf's textbook on embedded computing systems.", "c": "Programming & CS"},
  {"id": "B08TRLDR2Q", "t": "Computer Organization and Design RISC-V Edition: The Hardware Software Interface (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "David A. Patterson, John L. Hennessy", "p": 700, "d": "RISC-V edition of Patterson and Hennessy's CompArch textbook.", "c": "Programming & CS"},
  {"id": "B078MFDTX4", "t": "Computer Architecture: A Quantitative Approach (The Morgan Kaufmann Series in Computer Architecture and Design)", "a": "John L. Hennessy, David A. Patterson", "p": 936, "d": "Hennessy and Patterson's graduate-level architecture textbook.", "c": "Programming & CS"},
  {"id": "1891121014", "t": "Introduction to Airborne Radar", "a": "George W. Stimson", "p": 584, "d": "Stimson's classic textbook on airborne radar systems.", "c": "Programming & CS"},
  {"id": "1839532165", "t": "Understandable Electronic Devices: Key concepts and circuit design (Materials, Circuits and Devices)", "a": "Meizhong Wang", "p": 524, "d": "Wang's textbook on electronic devices and circuit design.", "c": "Programming & CS"},
  {"id": "1839532807", "t": "Sustainable High-Rise Buildings: Design, technology, and innovation (Built Environment)", "a": "Kheir Al-Kodmany, Peng Du", "p": null, "d": "Al-Kodmany on sustainable design of high-rise buildings.", "c": "Programming & CS"},
  {"id": "B084V84PM7", "t": "Make it Clear: Speak and Write to Persuade and Inform", "a": "Patrick Henry Winston, Gill Pratt", "p": 240, "d": "Winston's posthumous book on speaking and writing to persuade.", "c": "Production"},
  {"id": "013359162X", "t": "Modern Operating Systems", "a": "Andrew Tanenbaum, Herbert Bos", "p": 1136, "d": "Tanenbaum's classic OS textbook.", "c": "Programming & CS"},
  {"id": "0735684189", "t": "Windows Internals: System architecture, processes, threads, memory management, and more, Part 1 (Developer Reference)", "a": "David Solomon, Mark Russinovich", "p": 800, "d": "Russinovich's reference on Windows internals (Part 1).", "c": "Programming & CS"},
  {"id": "0135462401", "t": "Windows Internals, Part 2 (Developer Reference)", "a": "Mark Russinovich, Andrea Allievi", "p": 700, "d": "Companion volume covering Windows kernel subsystems (Part 2).", "c": "Programming & CS"},
  {"id": "0201633612", "t": "Design Patterns: Elements of Reusable Object-Oriented Software", "a": "Erich Gamma, Richard Helm", "p": 395, "d": "Gang of Four's classic OOP design-patterns book.", "c": "Programming & CS"},
  {"id": "0471197130", "t": "AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis", "a": "William J. Brown, Raphael C. Malveau", "p": 336, "d": "Brown's catalog of common software-design and management anti-patterns.", "c": "Programming & CS"},
  {"id": "0201704315", "t": "Modern C++ Design: Generic Programming and Design Patterns Applied (C++ In-Depth Series)", "a": "Debbie Lafferty, Andrei Alexandrescu", "p": 323, "d": "Alexandrescu's classic on advanced C++ generic-programming techniques.", "c": "Programming & CS"},
  {"id": "0670033049", "t": "East of Eden", "a": "John Steinbeck", "p": 608, "d": "Steinbeck's multigenerational California saga of the Trask and Hamilton families.", "c": "Classics"},
  {"id": "0143039431", "t": "The Grapes of Wrath", "a": "John Steinbeck, Robert DeMott", "p": 608, "d": "Steinbeck's Pulitzer-winning Dust Bowl novel of the Joad family.", "c": "Classics"},
  {"id": "B002L4EX9C", "t": "The Short Novels of John Steinbeck: (Penguin Classics Deluxe Edition)", "a": "John Steinbeck", "p": 640, "d": "Penguin Deluxe edition collecting Steinbeck's shorter fiction.", "c": "Classics"},
  {"id": "B003WOLHUI", "t": "Beyond the C++ Standard Library: An Introduction to Boost", "a": "Björn Karlsson", "p": 432, "d": "Karlsson's textbook on the Boost C++ libraries.", "c": "Programming & CS"},
  {"id": "0201749629", "t": "Effective STL: 50 Specific Ways to Improve Your Use of the Standard Template Library (Addison-Wesley Professional Computing Series)", "a": "Scott Meyers", "p": 260, "d": "Meyers's bestseller on effective use of the C++ STL.", "c": "Programming & CS"},
  {"id": "8590379868", "t": "Programming in Lua, fourth edition", "a": "Roberto Ierusalimschy", "p": 336, "d": "Ierusalimschy's authoritative textbook on the Lua language.", "c": "Programming & CS"},
  {"id": "8590379841", "t": "Lua Programming Gems", "a": "Luiz Henrique De Figueiredo, Waldemar Celes", "p": 576, "d": "Anthology of Lua programming techniques.", "c": "Programming & CS"},
  {"id": "1398809705", "t": "The Classic Charles Dickens Collection: 5-Book Paperback Boxed Set (Arcturus Classic Collections)", "a": "Charles Dickens", "p": null, "d": "Five-novel paperback boxed set of Dickens classics.", "c": "Classics"},
  {"id": "1584505133", "t": "Programming Vertex, Geometry, and Pixel Shaders", "a": "Wolfgang Engel", "p": 320, "d": "Engel's textbook on programming GPU shader stages.", "c": "Game Design"},
  {"id": "B00918NNIS", "t": "Practical Rendering and Computation with Direct3D 11", "a": "Jason Zink, Matt Pettineo", "p": 629, "d": "Zink's textbook on Direct3D 11 graphics programming.", "c": "Game Design"},
  {"id": "B00UVAQ76K", "t": "3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics (The Morgan Kaufmann Series in Interactive 3d Technology)", "a": "David H. Eberly", "p": 1056, "d": "Eberly's classic textbook on game-engine real-time graphics.", "c": "Game Design"},
  {"id": "012229064X", "t": "3D Game Engine Architecture: Engineering Real-Time Applications with Wild Magic (The Morgan Kaufmann Series in Interactive 3D Technology)", "a": "David Eberly", "p": 1016, "d": "Eberly's textbook on game-engine architecture using his Wild Magic engine.", "c": "Game Design"},
  {"id": "1138483974", "t": "AI for Games, Third Edition", "a": "Ian Millington", "p": 684, "d": "Millington's textbook on AI techniques for video games.", "c": "Game Design"},
  {"id": "1107602629", "t": "Enumerative Combinatorics: Volume 1 (Cambridge Studies in Advanced Mathematics, Series Number 49)", "a": "Richard P. Stanley", "p": 642, "d": "Stanley's classic graduate textbook on enumerative combinatorics, vol 1.", "c": "Mathematics"},
  {"id": "0521789877", "t": "Enumerative Combinatorics, Volume 2", "a": "Richard P. Stanley, Sergey Fomin", "p": 594, "d": "Stanley and Fomin's volume 2 on enumerative combinatorics.", "c": "Mathematics"},
  {"id": "B015PNELJW", "t": "Introduction to Enumerative and Analytic Combinatorics (Discrete Mathematics and Its Applications)", "a": "Miklos Bona", "p": 560, "d": "Bona's graduate textbook on enumerative and analytic combinatorics.", "c": "Mathematics"},
  {"id": "0521898064", "t": "Analytic Combinatorics", "a": "Philippe Flajolet, Robert Sedgewick", "p": 810, "d": "Flajolet and Sedgewick's definitive analytic-combinatorics textbook.", "c": "Mathematics"},
  {"id": "0131437372", "t": "Introduction to Graph Theory (Classic Version) (Pearson Modern Classics for Advanced Mathematics Series)", "a": "Douglas West", "p": 588, "d": "West's classic graph-theory textbook.", "c": "Mathematics"},
  {"id": "B01DY7LYLY", "t": "Graphical Enumeration", "a": "Frank Harary, Edgar M. Palmer", "p": 271, "d": "Harary and Palmer's classic on counting graphs and related structures.", "c": "Mathematics"},
  {"id": "0821847597", "t": "Matching Theory", "a": "Laszlo Lovasz, Michael D. Plummer", "p": 560, "d": "Lovasz and Plummer's graduate textbook on graph matching theory.", "c": "Mathematics"},
  {"id": "0486435962", "t": "Extremal Graph Theory (Dover Books on Mathematics)", "a": "Bela Bollobas", "p": 488, "d": "Bollobas's graduate text on extremal graph theory.", "c": "Mathematics"},
  {"id": "0471588903", "t": "Combinatorial Geometry", "a": "János Pach, Pankaj K. Agarwal", "p": 376, "d": "Pach and Agarwal's textbook on combinatorial geometry.", "c": "Mathematics"},
  {"id": "1118799666", "t": "Ramsey Theory, Second Edition (Wiley Series in Discrete Mathematics and Optimization)", "a": "Ronald L. Graham", "p": 228, "d": "Graham's textbook on Ramsey theory's combinatorial principles.", "c": "Mathematics"},
  {"id": "0764574817", "t": "Reversing: Secrets of Reverse Engineering", "a": "Eldad Eilam", "p": 619, "d": "Eilam's textbook on software reverse engineering.", "c": "Programming & CS"},
  {"id": "198508659X", "t": "Operating Systems: Three Easy Pieces", "a": "Remzi H Arpaci-Dusseau, Andrea C Arpaci-Dusseau", "p": 714, "d": "Arpaci-Dusseaus' free-online OS textbook.", "c": "Programming & CS"},
  {"id": "0262014467", "t": "The Audio Programming Book", "a": "Richard Boulanger, Victor Lazzarini", "p": 889, "d": "MIT Press anthology on audio and music programming.", "c": "Programming & CS"},
  {"id": "0790612046", "t": "DSP Filter Cookbook (Electronics Cookbook Series)", "a": "John Lane", "p": 256, "d": "Lane's practical guide to designing DSP filters.", "c": "Programming & CS"},
  {"id": "0861714911", "t": "In the Buddha's Words: An Anthology of Discourses from the Pali Canon (The Teachings of the Buddha)", "a": "Venerable Bhikkhu Bodhi, His Holiness the Dalai Lama", "p": 512, "d": "Bhikkhu Bodhi's anthology of teachings from the Pali Canon.", "c": "Classics"},
  {"id": "0486433595", "t": "Enchiridion (Dover Thrift Editions: Philosophy)", "a": "Epictetus, George Long", "p": 96, "d": "Epictetus's Stoic handbook in Long's classic translation.", "c": "Classics"},
  {"id": "0394719859", "t": "The Gay Science: With a Prelude in Rhymes and an Appendix of Songs (COLLECTIBLE)", "a": "Friedrich Nietzsche, Walter Kaufmann", "p": 400, "d": "Nietzsche's aphoristic book including the parable of the madman.", "c": "Classics"},
  {"id": "0123116341", "t": "Real-Time Cameras", "a": "Mark Haigh-Hutchinson", "p": 300, "d": "Haigh-Hutchinson's classic textbook on real-time game cameras.", "c": "Game Design"},
  {"id": "019533194X", "t": "Modal Counterpoint: Renaissance Style", "a": "Peter Schubert", "p": 192, "d": "Schubert's textbook on Renaissance modal counterpoint.", "c": "Music"},
  {"id": "0195394208", "t": "The Art of Partimento: History, Theory, and Practice", "a": "Giorgio Sanguinetti", "p": 768, "d": "Sanguinetti on the Neapolitan partimento improvisation tradition.", "c": "Music"},
  {"id": "0197514081", "t": "The Solfeggio Tradition: A Forgotten Art of Melody in the Long Eighteenth Century", "a": "Nicholas Baragwanath", "p": 480, "d": "Baragwanath on solfeggio melody training in 18th-century pedagogy.", "c": "Music"},
  {"id": "0262034859", "t": "Voice Leading: The Science behind a Musical Art", "a": "David Huron", "p": 288, "d": "Huron's empirical study of voice-leading principles.", "c": "Music"},
  {"id": "B005254IXS", "t": "A Geometry of Music: Harmony and Counterpoint in the Extended Common Practice (Oxford Studies in Music Theory)", "a": "Dmitri Tymoczko", "p": 480, "d": "Tymoczko's geometric theory of harmony.", "c": "Music"},
  {"id": "0393095398", "t": "Twentieth-Century Harmony", "a": "Vincent Persichetti", "p": 304, "d": "Persichetti's classic textbook on twentieth-century harmonic practice.", "c": "Music"},
  {"id": "153723613X", "t": "Creative Orchestration: A Project Method For Classes In Orchestration And Instrumentation", "a": "George Frederick McKay, Frederick Leslie McKay", "p": null, "d": "McKay's project-based orchestration course.", "c": "Music"},
  {"id": "0393600521", "t": "The Study of Orchestration", "a": "Samuel Adler", "p": 864, "d": "Adler's standard graduate-level textbook on orchestration.", "c": "Music"},
  {"id": "0825868270", "t": "Textures and Timbres: An Orchestrator’s Handbook", "a": "Henry Brant", "p": 256, "d": "Brant's textbook on orchestral textures and combinations.", "c": "Music"},
  {"id": "0571514561", "t": "Behind Bars: The Definitive Guide to Music Notation (Faber Edition)", "a": "Elaine Gould", "p": 704, "d": "Gould's authoritative reference on music notation practice.", "c": "Music"},
  {"id": "0201484021", "t": "How Children Fail (Classics in Child Development)", "a": "John Holt", "p": 320, "d": "Holt's classic on how schools cause failure in children.", "c": "Self-Help & Business"},
  {"id": "B06X9CZZ7J", "t": "Montedidio", "a": "Erri De Luca, Roberto De Francesco", "p": null, "d": "De Luca's lyrical novel of a Naples boy carrying a wooden boomerang.", "c": "Fiction"},
  {"id": "B08TLXFFB8", "t": "Tre cavalli", "a": "Erri De Luca, Simone Borrelli", "p": null, "d": "De Luca's short novel of a man, three horses, and the women in his life.", "c": "Fiction"},
  {"id": "022608020X", "t": "Life Out of Sequence: A Data-Driven History of Bioinformatics", "a": "Hallam Stevens", "p": 264, "d": "Stevens's history of bioinformatics as a data-driven discipline.", "c": "Science"},
  {"id": "9811642400", "t": "Bioinformatics and Computational Biology: A Primer for Biologists", "a": "Basant K. Tiwary", "p": null, "d": "Tiwary's primer on bioinformatics for biologists.", "c": "Science"},
  {"id": "0140280197", "t": "The 48 Laws of Power", "a": "Robert Greene", "p": 480, "d": "Greene's bestseller on historical patterns of power.", "c": "Self-Help & Business"},
  {"id": "0198794142", "t": "Introduction to Bioinformatics", "a": "Arthur Lesk", "p": 368, "d": "Lesk's standard introductory bioinformatics textbook.", "c": "Science"},
  {"id": "0486287386", "t": "Up from Slavery (Dover Thrift Editions: Black History)", "a": "Booker T. Washington", "p": 160, "d": "Washington's autobiography from slavery to founding Tuskegee.", "c": "Classics"},
  {"id": "0802123783", "t": "Killing Pablo: The Hunt for the World's Greatest Outlaw", "a": "Mark Bowden", "p": 320, "d": "Bowden's narrative account of the hunt for Pablo Escobar.", "c": "History"},
  {"id": "B00W11SMR4", "t": "The Complete Works of Robert Louis Stevenson: Novels, stories, poems, plays, travel sketches, memoirs, letters and essays - a 19th-century illustrated edition", "a": "Robert Louis Stevenson", "p": null, "d": "Stevenson's complete works in a single Kindle volume.", "c": "Classics"},
  {"id": "0143039679", "t": "The Ramayana: A Shortened Modern Prose Version of the Indian Epic (Penguin Classics)", "a": "R. K. Narayan, Pankaj Mishra", "p": 192, "d": "Narayan's prose retelling of the Hindu epic of Rama.", "c": "Classics"},
  {"id": "0143039644", "t": "The Guide: A Novel (Penguin Classics)", "a": "R. K. Narayan, Michael Gorra", "p": 224, "d": "Narayan's classic Indian novel of the reluctant holy man Raju.", "c": "Classics"},
  {"id": "B0BTP1WNPK", "t": "Robinson Crusoe: The Original 1719 Edition (A Daniel Defoe Classic Novel)", "a": "Daniel Defoe", "p": null, "d": "Defoe's 1719 castaway novel.", "c": "Classics"},
  {"id": "0262533499", "t": "Why Only Us: Language and Evolution", "a": "Robert C. Berwick, Noam Chomsky", "p": 224, "d": "Berwick and Chomsky on the evolution of human language faculty.", "c": "Science"},
  {"id": "0671657135", "t": "The Society of Mind", "a": "Marvin Minsky", "p": 336, "d": "Minsky's classic on mind as a society of agents.", "c": "Science"},
  {"id": "0743276647", "t": "The Emotion Machine: Commonsense Thinking, Artificial Intelligence, and the Future of the Human Mind", "a": "Marvin Minsky", "p": 400, "d": "Minsky's later book extending his Society of Mind theory.", "c": "Science"},
  {"id": "0521874157", "t": "Statistical Machine Translation", "a": "Philipp Koehn", "p": 488, "d": "Koehn's textbook on statistical machine translation.", "c": "Programming & CS"},
  {"id": "014312918X", "t": "The English Teacher: A Novel", "a": "Yiftach Reicher Atir, Philip Simpson", "p": 256, "d": "Atir's spy novel about a female Mossad agent in Iran.", "c": "Fiction"},
  {"id": "0262533413", "t": "The Character of Physical Law, with new foreword (Mit Press)", "a": "Richard Feynman, Frank Wilczek", "p": 192, "d": "Feynman's lectures on the laws of physics.", "c": "Science"},
  {"id": "0802142664", "t": "The English Teacher", "a": "Lily King", "p": 272, "d": "King's novel of a teacher whose past collides with her family life.", "c": "Fiction"},
  {"id": "0262046474", "t": "Computational Imaging", "a": "Ayush Bhandari, Achuta Kadambi", "p": 528, "d": "Bhandari's textbook on computational imaging methods.", "c": "Programming & CS"},
  {"id": "0553212753", "t": "Little Women (Bantam Classics)", "a": "Louisa May Alcott", "p": 576, "d": "Alcott's classic of the four March sisters in Civil War-era Massachusetts.", "c": "Classics"},
  {"id": "0921586868", "t": "Guilty of Everything", "a": "John Armstrong", "p": 208, "d": "Armstrong's poetry collection.", "c": "Fiction"},
  {"id": "1554200296", "t": "Wages", "a": "John Armstrong", "p": 96, "d": "Armstrong's poetry collection.", "c": "Fiction"},
  {"id": "0316438502", "t": "Zilot & Other Important Rhymes", "a": "Bob Odenkirk, Erin Odenkirk", "p": 96, "d": "Odenkirk's children's book of family-invented nonsense words.", "c": "Fiction"},
  {"id": "1524761389", "t": "To Shake the Sleeping Self: A Journey from Oregon to Patagonia, and a Quest for a Life with No Regret", "a": "Jedidiah Jenkins", "p": 384, "d": "Jenkins's memoir of bicycling Oregon to Patagonia.", "c": "Fiction"},
  {"id": "B0861857FB", "t": "Like Streams to the Ocean: Notes on Ego, Love, and the Things That Make Us Who We Are", "a": "Jedidiah Jenkins, Random House Audio", "p": 208, "d": "Jenkins's essays on identity, family, and finding peace.", "c": "Fiction"},
  {"id": "0593137264", "t": "Mother, Nature: A 5,000-Mile Journey to Discover if a Mother and Son Can Survive Their Differences", "a": "Jedidiah Jenkins", "p": 288, "d": "Jenkins's road-trip memoir with his mother across America.", "c": "Fiction"},
  {"id": "0131873253", "t": "Database Systems: The Complete Book", "a": "Hector Garcia-Molina, Jeffrey Ullman", "p": 1248, "d": "Garcia-Molina's classic database-systems textbook.", "c": "Programming & CS"},
  {"id": "0273769278", "t": "A First Course in Database Systems: International Edition", "a": "Jeffrey D Ullman, Jennifer Widom", "p": null, "d": "Ullman and Widom's database-systems textbook (intl edition).", "c": "Programming & CS"},
  {"id": "0137935102", "t": "Art of Computer Programming, The, Volumes 1-4B, Boxed Set", "a": "Donald Knuth", "p": null, "d": "Knuth's complete Art of Computer Programming volumes 1-4B.", "c": "Programming & CS"},
  {"id": "0486284735", "t": "Pride and Prejudice (Dover Thrift Editions: Classic Novels)", "a": "Jane Austen", "p": 272, "d": "Austen's beloved Bennet-family Regency comedy of manners.", "c": "Classics"},
  {"id": "0486424499", "t": "Jane Eyre (Dover Thrift Editions: Classic Novels)", "a": "Charlotte Brontë", "p": 368, "d": "Bronte's classic Dover-edition reprint.", "c": "Classics"},
  {"id": "039335279X", "t": "Misbehaving: The Making of Behavioral Economics", "a": "Richard H. Thaler", "p": 432, "d": "Thaler's memoir on the development of behavioral economics.", "c": "Self-Help & Business"},
  {"id": "014313700X", "t": "Nudge: The Final Edition", "a": "Richard H. Thaler, Cass R. Sunstein", "p": 384, "d": "Thaler and Sunstein on choice architecture and libertarian paternalism.", "c": "Self-Help & Business"},
  {"id": "B06XPJML5D", "t": "Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems", "a": "Martin Kleppmann", "p": 616, "d": "Kleppmann's reference on building modern distributed data systems.", "c": "Programming & CS"},
  {"id": "1492040347", "t": "Database Internals: A Deep Dive into How Distributed Data Systems Work", "a": "Alex Petrov", "p": 376, "d": "Petrov's textbook on database storage and replication internals.", "c": "Programming & CS"},
  {"id": "1934356557", "t": "SQL Antipatterns: Avoiding the Pitfalls of Database Programming (Pragmatic Programmers)", "a": "Bill Karwin", "p": 336, "d": "Karwin's Pragmatic Bookshelf book on common SQL design pitfalls.", "c": "Programming & CS"},
  {"id": "0321826620", "t": "NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence", "a": "Pramod Sadalage, Martin Fowler", "p": 192, "d": "Sadalage and Fowler's compact NoSQL overview.", "c": "Programming & CS"},
  {"id": "0143127748", "t": "The Body Keeps the Score: Brain, Mind, and Body in the Healing of Trauma", "a": "Bessel van der Kolk M.D.", "p": 464, "d": "Van der Kolk's bestseller on trauma's somatic effects and treatment.", "c": "Science"},
  {"id": "0596514808", "t": "Intel Threading Building Blocks: Outfitting C++ for Multi-core Processor Parallelism", "a": "James Reinders", "p": 336, "d": "Reinders's textbook on Intel TBB parallel programming.", "c": "Programming & CS"},
  {"id": "0321842685", "t": "Hacker's Delight", "a": "Henry Warren", "p": 512, "d": "Warren's classic of bit-twiddling tricks for low-level coders.", "c": "Programming & CS"},
  {"id": "0394756827", "t": "Gödel, Escher, Bach: An Eternal Golden Braid", "a": "Douglas Hofstadter", "p": 777, "d": "Hofstadter's Pulitzer-winning meditation on minds, machines, and meaning.", "c": "Programming & CS"},
  {"id": "194883653X", "t": "Indistractable: How to Control Your Attention and Choose Your Life", "a": "Nir Eyal", "p": 304, "d": "Eyal on building immunity to digital and other distractions.", "c": "Self-Help & Business"},
  {"id": "B007TB5SKA", "t": "Tubes: Behind the Scenes at the Internet", "a": "Andrew Blum", "p": 304, "d": "Blum's reportage on the physical infrastructure of the internet.", "c": "Science"},
  {"id": "0133506487", "t": "Data and Computer Communications (William Stallings Books on Computer and Data Communications)", "a": "William Stallings", "p": 912, "d": "Stallings's classic data-and-computer-communications textbook.", "c": "Programming & CS"},
  {"id": "0134997190", "t": "Computer Organization and Architecture [RENTAL EDITION]", "a": "William Stallings", "p": 752, "d": "Stallings's textbook on computer organization and architecture.", "c": "Programming & CS"},
  {"id": "0132915383", "t": "Digital & Analog Communication Systems", "a": "Leon Couch", "p": 816, "d": "Couch's textbook on analog and digital communications.", "c": "Programming & CS"},
  {"id": "1118642066", "t": "Antenna Theory: Analysis and Design", "a": "Constantine A. Balanis", "p": 1104, "d": "Balanis's standard graduate textbook on antenna theory.", "c": "Programming & CS"},
  {"id": "0470576642", "t": "Antenna Theory and Design", "a": "Warren L. Stutzman, Gary A. Thiele", "p": 843, "d": "Stutzman's textbook on antenna theory and design.", "c": "Programming & CS"},
  {"id": "1625951582", "t": "ARRL Handbook for Radio Communications 100th Edition Six-Volume Set – The Comprehensive RF Engineering Reference", "a": "ARRL Inc.", "p": null, "d": "ARRL's six-volume amateur-radio engineering reference.", "c": "Programming & CS"},
  {"id": "0135180392", "t": "Network Programmability with YANG: The Structure of Network Automation with YANG, NETCONF, RESTCONF, and gNMI", "a": "Benoit Claise, Joe Clarke", "p": 560, "d": "Claise's book on YANG/NETCONF/RESTCONF for network automation.", "c": "Programming & CS"},
  {"id": "0385495323", "t": "The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography", "a": "Simon Singh", "p": 432, "d": "Singh's history of cryptography from antiquity to quantum-key distribution.", "c": "History"},
  {"id": "1841157910", "t": "Fermat's Last Theorem", "a": "Dr. Simon Singh Simon Singh", "p": 368, "d": "Singh's narrative history of Wiles's proof of Fermat's Last Theorem.", "c": "Science"},
  {"id": "0521837162", "t": "Wireless Communications", "a": "Andrea Goldsmith", "p": 644, "d": "Goldsmith's textbook on wireless communications theory.", "c": "Programming & CS"},
  {"id": "0201633744", "t": "Cdma: Principles of Spread Spectrum Communication (Addison-Wesley Wireless Communications)", "a": "Andrew J. Viterbi", "p": 245, "d": "Viterbi's classic textbook on CDMA spread-spectrum communications.", "c": "Programming & CS"},
  {"id": "B0C7C72LHL", "t": "Lash Serum - Eyelash Growth Serum for Natural Fuller & Longer Looking Lashes & Brows Rapid Enhancing Grow Eyelashes, No Cruelty Vegan", "a": "", "p": null, "d": "Cosmetic eyelash-growth serum (not a book).", "c": "Self-Help & Business"},
  {"id": "1973252112", "t": "Wireless Networking: Introduction to Bluetooth and WiFi", "a": "Gordon Colbach", "p": 190, "d": "Colbach's textbook on Bluetooth and WiFi.", "c": "Programming & CS"},
  {"id": "1119714672", "t": "From GSM to LTE-Advanced Pro and 5G: An Introduction to Mobile Networks and Mobile Broadband", "a": "Martin Sauter", "p": 916, "d": "Sauter's textbook on cellular networks from GSM to 5G.", "c": "Programming & CS"},
  {"id": "0684831309", "t": "The Codebreakers: The Comprehensive History of Secret Communication from Ancient Times to the Internet", "a": "David Kahn", "p": 1181, "d": "Kahn's classic 1967 history of cryptography.", "c": "History"},
  {"id": "9123655399", "t": "The Three Body Problem Collection 4 Books Set (International Edition)", "a": "Cixin Liu", "p": null, "d": "Three-Body Problem trilogy in a four-book set (Cixin Liu).", "c": "Fiction"},
  {"id": "4274065421", "t": "Mastering TCP / IP SSL / TLS Hen - JAPANESE", "a": "Eric Rescorla", "p": null, "d": "Japanese edition of Rescorla's TLS textbook.", "c": "Programming & CS"},
  {"id": "013409266X", "t": "Computer Systems: A Programmer's Perspective", "a": "Randal Bryant, David O'Hallaron", "p": 1120, "d": "Bryant and O'Hallaron's classic textbook on systems programming.", "c": "Programming & CS"},
  {"id": "B08HQ7XNLD", "t": "The Art of Multiprocessor Programming", "a": "Maurice Herlihy, Nir Shavit", "p": 528, "d": "Herlihy and Shavit's textbook on concurrent algorithms and data structures.", "c": "Programming & CS"},
  {"id": "B0037JO5J8", "t": "Security Analysis: Sixth Edition, Foreword by Warren Buffett (Security Analysis Prior Editions)", "a": "Benjamin Graham, David Dodd", "p": 832, "d": "Graham and Dodd's classic value-investing textbook.", "c": "Self-Help & Business"},
  {"id": "0471445509", "t": "Common Stocks and Uncommon Profits and Other Writings (Wiley Investment Classics)", "a": "Philip A. Fisher, Ken Fisher", "p": 320, "d": "Fisher's classic 1958 book on growth-stock investing.", "c": "Self-Help & Business"},
  {"id": "0375714367", "t": "Cutting for Stone", "a": "Abraham Verghese", "p": 688, "d": "Verghese's novel of twin brothers and an Ethiopian mission hospital.", "c": "Fiction"},
  {"id": "0802162177", "t": "The Covenant of Water (Oprah's Book Club)", "a": "Abraham Verghese", "p": 736, "d": "Verghese's multigenerational novel of a Kerala family.", "c": "Fiction"},
  {"id": "0062116398", "t": "The Tennis Partner: A Doctor's Story of Friendship and Loss (P.S.)", "a": "Abraham Verghese", "p": 368, "d": "Verghese's memoir of his friendship with a tennis-playing addict.", "c": "Fiction"},
  {"id": "1554987652", "t": "The Breadwinner (Breadwinner Series, 1)", "a": "Deborah Ellis", "p": 192, "d": "Ellis's middle-grade novel of a girl posing as a boy in Taliban-era Kabul.", "c": "Fiction"},
  {"id": "1554987709", "t": "Parvana’s Journey (Breadwinner Series, 2)", "a": "Deborah Ellis", "p": 208, "d": "Ellis's sequel: Parvana searches for her family across Afghanistan.", "c": "Fiction"},
  {"id": "1554987733", "t": "Mud City (Breadwinner Series, 3)", "a": "Deborah Ellis", "p": 224, "d": "Ellis's third Breadwinner book: Shauzia in a Pakistani refugee camp.", "c": "Fiction"},
  {"id": "1554982987", "t": "My Name Is Parvana (Breadwinner Series, 4)", "a": "Deborah Ellis", "p": 208, "d": "Ellis's fourth Breadwinner book: Parvana in detention by U.S. forces.", "c": "Fiction"},
  {"id": "0192786938", "t": "One More Mountain", "a": "Deborah Ellis", "p": 192, "d": "Ellis's recent Breadwinner-universe novel.", "c": "Fiction"},
  {"id": "0375703764", "t": "House of Leaves", "a": "Mark Z. Danielewski", "p": 709, "d": "Danielewski's experimental horror novel of a house bigger inside than out.", "c": "Fiction"},
  {"id": "B0CPTB4FTD", "t": "FASTER THAN LIGHT: HOW YOUR SHADOW CAN DO IT BUT YOU CAN'T", "a": "Robert J. Nemiroff", "p": null, "d": "Nemiroff's popular-physics book on faster-than-light shadow motion.", "c": "Science"},
  {"id": "1901983056", "t": "How to Beat Your Dad at Chess (Chess for Kids)", "a": "Murray Chandler", "p": 128, "d": "Chandler's beginner chess tactics primer for kids.", "c": "Chess"},
  {"id": "1906454256", "t": "1001 Deadly Checkmates", "a": "John Nunn", "p": 304, "d": "Nunn's collection of mate-in-2-or-3 puzzles.", "c": "Chess"},
  {"id": "1849947252", "t": "1000 Checkmate Combinations", "a": "Victor Henkin", "p": 512, "d": "Henkin's collection of one-thousand checkmate combination puzzles.", "c": "Chess"},
  {"id": "1901983986", "t": "Learn Chess Tactics", "a": "John Nunn", "p": 160, "d": "Nunn's beginner-level book on tactical motifs.", "c": "Chess"},
  {"id": "1880673134", "t": "Sharpen Your Tactics: 1125 Brilliant Sacrifices, Combinations, and Studies", "a": "Anatoly Lein, Boris Archangelsky", "p": 290, "d": "Lein's collection of advanced tactical exercises.", "c": "Chess"},
  {"id": "0486205835", "t": "The Art of Chess Combination (Dover Chess)", "a": "Eugene Znosko-Borovsky", "p": 208, "d": "Znosko-Borovsky's classic short text on attacking chess.", "c": "Chess"},
  {"id": "8672971140", "t": "Encyclopedia of Chess Combinations - 6th Edition", "a": "Chess Informant", "p": null, "d": "Chess Informant's encyclopedia of tactical combinations.", "c": "Chess"},
  {"id": "1906454132", "t": "FCO: Fundamental Chess Openings", "a": "Paul Van der Sterren", "p": 480, "d": "Van der Sterren's textbook on chess opening principles.", "c": "Chess"},
  {"id": "1857444000", "t": "Art of Attack in Chess", "a": "Vladimir Vukovic", "p": 336, "d": "Vukovic's classic on attacking the king in chess.", "c": "Chess"},
  {"id": "9056917161", "t": "Chess Strategy for Club Players: The Road to Positional Advantage", "a": "Herman Grooten", "p": 432, "d": "Grooten's textbook on positional chess for club players.", "c": "Chess"},
  {"id": "1890085138", "t": "How to Reassess Your Chess: Chess Mastery Through Chess Imbalances", "a": "Jeremy Silman", "p": 656, "d": "Silman's classic on chess imbalances and reassessment.", "c": "Chess"},
  {"id": "1906454272", "t": "Understanding Chess Middlegames", "a": "John Nunn", "p": 368, "d": "Nunn's textbook on chess middlegame principles.", "c": "Chess"},
  {"id": "1784830003", "t": "Chess Structures", "a": "Mauricio Flores Rios", "p": 464, "d": "Rios's textbook on typical pawn structures and their plans.", "c": "Chess"},
  {"id": "908331121X", "t": "100 Endgames You Must Know: Vital Lessons for Every Chess Player", "a": "Jesus de la Villa", "p": 260, "d": "De la Villa's must-know endgame manual.", "c": "Chess"},
  {"id": "1901983536", "t": "Fundamental Chess Endings", "a": "Karsten Müller, Frank Lamprecht", "p": 416, "d": "Muller and Lamprecht's standard graduate-level endgame textbook.", "c": "Chess"},
  {"id": "1963885147", "t": "Dvoretsky's Endgame Manual", "a": "Mark Dvoretsky, Magnus Carlsen", "p": 424, "d": "Dvoretsky's classic endgame manual.", "c": "Chess"},
  {"id": "9056914944", "t": "Van Perlo's Endgame Tactics: A Comprehensive Guide to the Sunny Side of Chess Endgames", "a": "Ger van Perlo", "p": 480, "d": "Van Perlo's huge collection of practical endgame tactics.", "c": "Chess"},
  {"id": "B00HDOD6S4", "t": "Nunn's Chess Endings Volume 1", "a": "John Nunn", "p": 320, "d": "Nunn's analysis of his own endgame play, vol 1.", "c": "Chess"},
  {"id": "B00HDODCRY", "t": "Nunn's Chess Endings Volume 2", "a": "John Nunn", "p": 320, "d": "Nunn's analysis of his own endgame play, vol 2.", "c": "Chess"},
  {"id": "B0B3SFKP3X", "t": "Endgame Strategy", "a": "Mikhail Shereshevsky", "p": null, "d": "Shereshevsky's classic on endgame strategy.", "c": "Chess"},
  {"id": "B00JKR7DKO", "t": "How to Play Chess Endgames (Endgame Strategy)", "a": "Karsten Müller, Wolfgang Pajeken", "p": 320, "d": "Muller's textbook on the practical endgame.", "c": "Chess"},
  {"id": "B07D8ZMPWW", "t": "Logical Chess: Move By Move: Every Move Explained New Algebraic Edition (Irving Chernev)", "a": "Irving Chernev", "p": 256, "d": "Chernev's classic move-by-move annotated games for learners.", "c": "Chess"},
  {"id": "B008QO3XVK", "t": "Understanding Chess Move by Move", "a": "John Nunn", "p": null, "d": "Nunn's annotated-game collection for improvers.", "c": "Chess"},
  {"id": "B001FSK3H6", "t": "Practical Chess Exercises: 600 Lessons from Tactics to Strategy", "a": "Ray Cheng", "p": 192, "d": "Cheng's collection of in-position practical exercises.", "c": "Chess"},
  {"id": "4871875903", "t": "The Best Move", "a": "Vlastimil Hort, Vlastimil Jansa", "p": null, "d": "Hort and Jansa's classic Czech book of position-finding exercises.", "c": "Chess"},
  {"id": "B00MV13A3A", "t": "Perfect Your Chess (Chess Tactics)", "a": "Andrei Volokitin, Vladimir Grabinsky", "p": null, "d": "Volokitin's advanced tactical-training workbook.", "c": "Chess"},
  {"id": "B0F7Y53ZRX", "t": "Ten Essays on Zionism and Judaism", "a": "Ahad Ha'am", "p": null, "d": "Ahad Ha'am's foundational essays on cultural Zionism.", "c": "Philosophy"},
  {"id": "B01M32DKVU", "t": "Words of Fire: Selected Essays of Ahad Ha'am", "a": "Ahad Ha'am", "p": null, "d": "Selected essays of cultural Zionist Ahad Ha'am.", "c": "Philosophy"},
  {"id": "1506711987", "t": "Berserk Deluxe Volume 1", "a": "Kentaro Miura, Jason DeAngelis", "p": 696, "d": "Miura's dark fantasy manga in oversized deluxe-edition format, vol 1.", "c": "Fiction"},
  {"id": "1607064111", "t": "Invincible Compendium Volume 1", "a": "Robert Kirkman, Cory Walker", "p": 1056, "d": "Kirkman's superhero comic compendium, first 47 issues.", "c": "Fiction"},
  {"id": "1974709930", "t": "Chainsaw Man, Vol. 1: Dog And Chainsaw", "a": "Tatsuki Fujimoto", "p": 208, "d": "Fujimoto's manga of a chainsaw-headed devil hunter, volume 1.", "c": "Fiction"},
  {"id": "9354215548", "t": "A Short History Of The Printing Press And Of The Improvements In Printing Machinery From The Time Of Gutenberg Up To The Present Day", "a": "Robert Hoe", "p": null, "d": "Hoe's compact 1902 history of printing technology.", "c": "History"},
  {"id": "B0DPFKZ42W", "t": "There's Got to Be a Better Way: How to Deliver Results and Get Rid of the Stuff That Gets in the Way of Real Work", "a": "Nelson P. Repenning, Donald C. Kieffer", "p": null, "d": "Repenning and Kieffer on systems thinking for organizational improvement.", "c": "Self-Help & Business"},
  {"id": "0393355624", "t": "“Surely You’re Joking, Mr. Feynman!”: Adventures of a Curious Character", "a": "Richard P. Feynman, Ralph Leighton", "p": 391, "d": "Feynman's bestseller anecdotes from a career in physics.", "c": "Science"},
  {"id": "0393355640", "t": "\"What Do You Care What Other People Think?\": Further Adventures of a Curious Character", "a": "Richard P. Feynman, Ralph Leighton", "p": 256, "d": "Feynman's second collection of anecdotes including the Challenger work.", "c": "Science"},
  {"id": "1107602173", "t": "Revolutions in Twentieth-Century Physics", "a": "David J. Griffiths", "p": 256, "d": "Griffiths's accessible book on twentieth-century physics revolutions.", "c": "History"},
  {"id": "1406612022", "t": "De Bono's Thinking Course (new edition): Powerful Tools to Transform Your Thinking", "a": "Edward De Bono", "p": 272, "d": "De Bono on creative problem-solving and lateral thinking.", "c": "Self-Help & Business"},
  {"id": "1568811306", "t": "Winning Ways for Your Mathematical Plays (AK Peters/CRC Recreational Mathematics Series)", "a": "Elwyn R. Berlekamp, John H. Conway", "p": 276, "d": "Berlekamp/Conway/Guy's classic combinatorial-game-theory volume 1.", "c": "Mathematics"},
  {"id": "156881142X", "t": "Winning Ways for Your Mathematical Plays, Vol. 2", "a": "Elwyn R. Berlekamp, John H. Conway", "p": 290, "d": "Volume 2 of Winning Ways: more combinatorial games analyzed.", "c": "Mathematics"},
  {"id": "1568811438", "t": "Winning Ways for Your Mathematical Plays, Volume 3 (AK Peters/CRC Recreational Mathematics Series)", "a": "Elwyn R. Berlekamp, John H. Conway", "p": 296, "d": "Volume 3 of Winning Ways: case studies of specific games.", "c": "Mathematics"},
  {"id": "1568811446", "t": "Winning Ways for Your Mathematical Plays, Volume 4 (AK Peters/CRC Recreational Mathematics Series)", "a": "Elwyn R. R. Berlekamp, John H. Conway", "p": 272, "d": "Volume 4 of Winning Ways: more games and theory.", "c": "Mathematics"},
  {"id": "1476753830", "t": "Salt, Fat, Acid, Heat: Mastering the Elements of Good Cooking", "a": "Samin Nosrat, Wendy MacNaughton", "p": 480, "d": "Nosrat's bestselling cookbook organized around four cooking elements.", "c": "Cooking"},
  {"id": "0684800012", "t": "On Food and Cooking: The Science and Lore of the Kitchen", "a": "Harold McGee", "p": 884, "d": "McGee's classic encyclopedia of food science for cooks.", "c": "Cooking"},
  {"id": "0470421355", "t": "The Professional Chef", "a": "The Culinary Institute of America (CIA)", "p": 1232, "d": "CIA's authoritative culinary-school reference.", "c": "Cooking"},
  {"id": "1416571728", "t": "Ratio: The Simple Codes Behind the Craft of Everyday Cooking (Ruhlman's Ratios)", "a": "Michael Ruhlman", "p": 256, "d": "Ruhlman's collection of fundamental cooking ratios for memorization.", "c": "Cooking"},
  {"id": "0470587806", "t": "Garde Manger: The Art and Craft of the Cold Kitchen", "a": "The Culinary Institute of America (CIA)", "p": 640, "d": "CIA's textbook on cold-kitchen pâté, charcuterie, and salad work.", "c": "Cooking"},
  {"id": "0470392673", "t": "How Baking Works: Exploring the Fundamentals of Baking Science", "a": "Paula I. Figoni", "p": 528, "d": "Figoni's textbook on the science of baking.", "c": "Cooking"},
  {"id": "0123743281", "t": "Game Feel (Morgan Kaufmann Game Design Books)", "a": "Steve Swink", "p": 376, "d": "Swink's textbook on the kinesthetic feel of video games.", "c": "Game Design"},
  {"id": "0262240459", "t": "Rules of Play: Game Design Fundamentals (Mit Press)", "a": "Katie Salen Tekinbas, Eric Zimmerman", "p": 688, "d": "Salen and Zimmerman's foundational game-design textbook.", "c": "Game Design"},
  {"id": "0571196586", "t": "Fundamentals of Musical Composition", "a": "Arnold Schoenberg", "p": 224, "d": "Schoenberg's textbook on tonal compositional craft.", "c": "Music"},
  {"id": "0262534495", "t": "A Composer's Guide to Game Music (Mit Press)", "a": "Winifred Phillips", "p": 288, "d": "Phillips's industry-insider guide to composing for video games.", "c": "Game Design"},
  {"id": "0199987297", "t": "Analyzing Classical Form: An Approach for the Classroom", "a": "William E. Caplin", "p": 752, "d": "Caplin's textbook on classical-era musical form.", "c": "Music"},
  {"id": "026253777X", "t": "Game Sound: An Introduction to the History, Theory, and Practice of Video Game Music and Sound Design (Mit Press)", "a": "KC Collins", "p": 192, "d": "Collins's academic introduction to game-music studies.", "c": "Game Design"},
  {"id": "0321961587", "t": "Writing Interactive Music for Video Games: A Composer's Guide (Game Design and Development)", "a": "Michael Sweet", "p": 560, "d": "Sweet's textbook on adaptive interactive music for games.", "c": "Game Design"},
  {"id": "B07BJZMTDW", "t": "Maximizing Game Feel Through Sound: A Composer/Sound Designer’s Approach to Upgrading your Game’s Impact", "a": "Akash Thakkar", "p": 160, "d": "Thakkar's short book on sound design for game-feel impact.", "c": "Game Design"},
  {"id": "0062651234", "t": "Blood, Sweat, and Pixels: The Triumphant, Turbulent Stories Behind How Video Games Are Made", "a": "Jason Schreier", "p": 294, "d": "Schreier's reportage on the chaos of making blockbuster video games.", "c": "Game Design"},
  {"id": "0823098478", "t": "Drawing Basics and Video Game Art: Classic to Cutting-Edge Art Techniques for Winning Video Game Design", "a": "Chris Solarski", "p": 192, "d": "Solarski's textbook on classical-art techniques for game art.", "c": "Game Design"},
  {"id": "1631590650", "t": "Figure Drawing for Artists: Making Every Mark Count (Volume 1)", "a": "Steve Huston", "p": 240, "d": "Huston's textbook on figure drawing for fine artists.", "c": "Art & Illustration"},
  {"id": "1781575789", "t": "How To Draw", "a": "Jake Spicer", "p": 160, "d": "Spicer's beginner-friendly drawing manual.", "c": "Art & Illustration"},
  {"id": "1781577021", "t": "Figure Drawing: A complete guide to drawing the human body", "a": "Jake Spicer", "p": 160, "d": "Spicer's introduction to figure drawing.", "c": "Art & Illustration"},
  {"id": "1781575266", "t": "You Will be Able to Draw Faces by the End of This Book", "a": "Jake Spicer", "p": 160, "d": "Spicer's beginner manual on drawing faces.", "c": "Art & Illustration"},
  {"id": "B008CG8E8Y", "t": "Game Mechanics: Advanced Game Design (Voices That Matter)", "a": "Ernest Adams, Joris Dormans", "p": 360, "d": "Adams and Dormans on game mechanics as systems.", "c": "Game Design"},
  {"id": "0134667603", "t": "Advanced Game Design: A Systems Approach", "a": "Michael Sellers", "p": 656, "d": "Sellers's textbook on systems-thinking-based game design.", "c": "Game Design"},
  {"id": "081536136X", "t": "An Architectural Approach to Level Design: Second edition", "a": "Christopher W. Totten", "p": 496, "d": "Totten's textbook on architectural principles in game level design.", "c": "Game Design"},
  {"id": "1498799574", "t": "Game Balance", "a": "Ian Schreiber, Brenda Romero", "p": 336, "d": "Schreiber and Romero's textbook on tuning game systems.", "c": "Game Design"},
  {"id": "B003GFIVT8", "t": "Kingdoms and Domains: An Illustrated Guide to the Phyla of Life on Earth", "a": "Lynn Margulis, Michael J. Chapman", "p": 240, "d": "Margulis's illustrated overview of the kingdoms and phyla of life.", "c": "Science"},
  {"id": "0521837405", "t": "An Introduction to Plant Structure and Development: Plant Anatomy for the Twenty-First Century", "a": "Charles B. Beck", "p": 480, "d": "Beck's textbook on plant anatomy.", "c": "Science"},
  {"id": "0130899364", "t": "Animal Behavior: Mechanism, Development, Function, and Evolution", "a": "Chris Barnard", "p": 740, "d": "Barnard's textbook on animal behavior.", "c": "Science"},
  {"id": "1631910108", "t": "2,100 Asanas: The Complete Yoga Poses", "a": "Daniel Lacerda", "p": 672, "d": "Lacerda's photographic compendium of yoga poses.", "c": "Self-Help & Business"},
  {"id": "0307338401", "t": "Secrets of Mental Math: The Mathemagician's Guide to Lightning Calculation and Amazing Math Tricks", "a": "Arthur Benjamin, Michael Shermer", "p": 256, "d": "Benjamin and Shermer on mental-arithmetic shortcuts.", "c": "Mathematics"},
  {"id": "1612681131", "t": "Rich Dad Poor Dad: What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!", "a": "Robert T. Kiyosaki", "p": 336, "d": "Kiyosaki's controversial bestseller on personal finance mindset.", "c": "Self-Help & Business"},
  {"id": "0671027034", "t": "How to Win Friends and Influence People", "a": "Dale Carnegie", "p": 288, "d": "Carnegie's 1936 self-help classic on social effectiveness.", "c": "Self-Help & Business"},
  {"id": "1591845947", "t": "The Charisma Myth: How Anyone Can Master the Art and Science of Personal Magnetism", "a": "Olivia Fox Cabane", "p": 288, "d": "Cabane on developing personal magnetism and presence.", "c": "Self-Help & Business"},
  {"id": "0307266303", "t": "Born to Run: A Hidden Tribe, Superathletes, and the Greatest Race the World Has Never Seen", "a": "Christopher McDougall", "p": 304, "d": "McDougall's bestseller on the Tarahumara and ultrarunning.", "c": "Self-Help & Business"},
  {"id": "0307389839", "t": "What I Talk About When I Talk About Running: A Memoir (Vintage International), Book Cover May Vary", "a": "Haruki Murakami", "p": 192, "d": "Murakami's memoir-essay on running and writing as parallel disciplines.", "c": "Self-Help & Business"},
  {"id": "1119013844", "t": "How Things Work: The Physics of Everyday Life", "a": "Louis A. Bloomfield", "p": 832, "d": "Bloomfield's introductory physics-of-everyday-life textbook.", "c": "Science"},
  {"id": "0521301319", "t": "Johannes Kepler New Astronomy", "a": "William H. Donahue, Owen Gingerich", "p": 1024, "d": "Donahue's translation of Kepler's 1609 astronomy treatise.", "c": "Science"},
  {"id": "B00CMSCSE4", "t": "A New Astronomy (Illustrated)", "a": "David Todd", "p": null, "d": "Reprint of Todd's 1900s introductory astronomy book.", "c": "Science"},
  {"id": "0345538374", "t": "J.R.R. Tolkien 4-Book Boxed Set: The Hobbit and The Lord of the Rings: The Hobbit, The Fellowship of the Ring, The Two Towers, The Return of the King", "a": "J.R.R. Tolkien", "p": 1216, "d": "Boxed set of Tolkien's Hobbit and Lord of the Rings trilogy.", "c": "Classics"},
  {"id": "1593275811", "t": "Android Security Internals: An In-Depth Guide to Android's Security Architecture", "a": "Nikolay Elenkov", "p": 432, "d": "Elenkov's deep-dive into Android's security architecture.", "c": "Programming & CS"},
  {"id": "1593279124", "t": "Practical Binary Analysis: Build Your Own Linux Tools for Binary Instrumentation, Analysis, and Disassembly", "a": "Dennis Andriesse", "p": 456, "d": "Andriesse's hands-on guide to binary instrumentation and analysis.", "c": "Programming & CS"},
  {"id": "1593272901", "t": "Practical Malware Analysis: The Hands-On Guide to Dissecting Malicious Software", "a": "Michael Sikorski, Andrew Honig", "p": 800, "d": "Sikorski and Honig's classic textbook on malware reverse engineering.", "c": "Programming & CS"},
];
const SEED_CATEGORIES = ["Classics", "Fiction", "Philosophy", "History", "Science", "Mathematics", "Programming & CS", "Game Design", "Art & Illustration", "Production", "Music", "Cooking", "Chess", "Self-Help & Business"];

// ============================================================
// CONFIG
// ============================================================
const STATUSES = ['To Read', 'Reading', 'Read'];
const STATUS_ICON = { 'To Read': BookOpen, 'Reading': BookMarked, 'Read': BookCheck };

// Curated category palette — modern editorial tones with bookshelf warmth.
const DEFAULT_CATEGORY_COLORS = {
  'Classics':            '#722F37',
  'Fiction':             '#2D5F8E',
  'Philosophy':          '#A8742B',
  'History':             '#3F5E3F',
  'Science':             '#2E6878',
  'Mathematics':         '#3D3A6A',
  'Programming & CS':    '#3A3A3A',
  'Game Design':         '#B5562F',
  'Art & Illustration':  '#A04F65',
  'Production':          '#5D3B5C',
  'Music':               '#7E2D3A',
  'Cooking':             '#A87C2A',
  'Chess':               '#4A5560',
  'Self-Help & Business':'#6B6840',
};

// Fallback palette for user-added categories.
const FALLBACK_COLORS = ['#7B3F4A','#3E5F8E','#A87C2A','#3F5E3F','#2E6878','#5D3B5C','#B5562F','#6B6840','#4A5560','#A04F65'];

const STORAGE_KEY = 'bookshelf_v1_state';

// ============================================================
// HELPERS
// ============================================================
function uid() { return 'b_' + Math.random().toString(36).slice(2, 11); }

function normalizeBook(b, idx) {
  return {
    id: b.id || uid(),
    title: b.t ?? b.title ?? '',
    author: b.a ?? b.author ?? '',
    pages: b.p ?? b.pages ?? null,
    description: b.d ?? b.description ?? '',
    category: b.c ?? b.category ?? 'Uncategorized',
    status: b.status ?? 'To Read',
    order: b.order ?? idx,
  };
}

function categoryColor(cat, customColors) {
  if (customColors[cat]) return customColors[cat];
  if (DEFAULT_CATEGORY_COLORS[cat]) return DEFAULT_CATEGORY_COLORS[cat];
  // Deterministic-ish fallback based on first char.
  const idx = (cat.charCodeAt(0) || 0) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[idx];
}

// ============================================================
// FONT INJECTION
// ============================================================
const FONT_LINK_ID = 'bookshelf-fonts';
function ensureFonts() {
  if (document.getElementById(FONT_LINK_ID)) return;
  const link = document.createElement('link');
  link.id = FONT_LINK_ID;
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400;1,9..144,500;1,9..144,600&family=Manrope:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Bookshelf() {
  const [books, setBooks] = useState(null);
  const [categories, setCategories] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [customColors, setCustomColors] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBook, setEditingBook] = useState(null);
  const [addingBook, setAddingBook] = useState(null); // { defaultCategory }
  const [managingCats, setManagingCats] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [draggedBook, setDraggedBook] = useState(null);
  const [dragOverCat, setDragOverCat] = useState(null);

  // Load fonts
  useEffect(() => { ensureFonts(); }, []);

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setBooks(parsed.books || []);
        setCategories(parsed.categories || SEED_CATEGORIES);
        setCollapsed(parsed.collapsed || {});
        setCustomColors(parsed.customColors || {});
      } else {
        setBooks(SEED_BOOKS.map(normalizeBook));
        setCategories(SEED_CATEGORIES);
      }
    } catch (e) {
      setBooks(SEED_BOOKS.map(normalizeBook));
      setCategories(SEED_CATEGORIES);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save to storage (debounced)
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!loaded || !books || !categories) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ books, categories, collapsed, customColors }));
      } catch (e) { console.error('save failed', e); }
    }, 400);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [books, categories, collapsed, customColors, loaded]);

  // ============================================================
  // DERIVED
  // ============================================================
  const filteredBooks = useMemo(() => {
    if (!books) return [];
    const q = search.trim().toLowerCase();
    return books.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (!q) return true;
      return (b.title || '').toLowerCase().includes(q)
          || (b.author || '').toLowerCase().includes(q)
          || (b.description || '').toLowerCase().includes(q);
    });
  }, [books, search, statusFilter]);

  const grouped = useMemo(() => {
    const g = {};
    for (const c of (categories || [])) g[c] = [];
    for (const b of filteredBooks) {
      if (!g[b.category]) g[b.category] = [];
      g[b.category].push(b);
    }
    for (const c in g) g[c].sort((a, b) => a.order - b.order);
    return g;
  }, [filteredBooks, categories]);

  const stats = useMemo(() => {
    if (!books) return null;
    const byStatus = { 'To Read': 0, 'Reading': 0, 'Read': 0 };
    for (const b of books) byStatus[b.status] = (byStatus[b.status] || 0) + 1;
    return { total: books.length, byStatus };
  }, [books]);

  // ============================================================
  // ACTIONS
  // ============================================================
  const cycleStatus = (id) => {
    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b;
      const i = STATUSES.indexOf(b.status);
      return { ...b, status: STATUSES[(i + 1) % STATUSES.length] };
    }));
  };

  const updateBook = (id, updates) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBook = (id) => {
    if (!confirm('Remove this book from your bookshelf?')) return;
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const addBook = (book) => {
    const targetCat = book.category || categories[0];
    const maxOrder = books.filter(b => b.category === targetCat).reduce((m, b) => Math.max(m, b.order), -1);
    setBooks(prev => [...prev, { ...book, id: uid(), category: targetCat, order: maxOrder + 1, status: book.status || 'To Read' }]);
  };

  const moveBook = (id, newCategory) => {
    if (!newCategory) return;
    const maxOrder = books.filter(b => b.category === newCategory && b.id !== id).reduce((m, b) => Math.max(m, b.order), -1);
    updateBook(id, { category: newCategory, order: maxOrder + 1 });
  };

  const reorderInCategory = (id, direction) => {
    setBooks(prev => {
      const book = prev.find(b => b.id === id);
      if (!book) return prev;
      const same = prev.filter(b => b.category === book.category).sort((a, b) => a.order - b.order);
      const idx = same.findIndex(b => b.id === id);
      const t = direction === 'up' ? idx - 1 : idx + 1;
      if (t < 0 || t >= same.length) return prev;
      const target = same[t];
      return prev.map(b => {
        if (b.id === id) return { ...b, order: target.order };
        if (b.id === target.id) return { ...b, order: book.order };
        return b;
      });
    });
  };

  const addCategory = (name) => {
    name = (name || '').trim();
    if (!name) return;
    if (categories.includes(name)) { alert('That shelf already exists.'); return; }
    setCategories(prev => [...prev, name]);
    // Assign next fallback color
    const used = new Set(Object.values({ ...DEFAULT_CATEGORY_COLORS, ...customColors }));
    const free = FALLBACK_COLORS.find(c => !used.has(c)) || FALLBACK_COLORS[0];
    setCustomColors(prev => ({ ...prev, [name]: free }));
  };

  const renameCategory = (oldName, newName) => {
    newName = (newName || '').trim();
    if (!newName || newName === oldName) return;
    if (categories.includes(newName)) { alert('A shelf with that name already exists.'); return; }
    setCategories(prev => prev.map(c => c === oldName ? newName : c));
    setBooks(prev => prev.map(b => b.category === oldName ? { ...b, category: newName } : b));
    setCustomColors(prev => {
      const next = { ...prev };
      const color = next[oldName] ?? DEFAULT_CATEGORY_COLORS[oldName];
      delete next[oldName];
      if (color) next[newName] = color;
      return next;
    });
    setCollapsed(prev => {
      const next = { ...prev };
      if (oldName in next) { next[newName] = next[oldName]; delete next[oldName]; }
      return next;
    });
  };

  const deleteCategory = (name) => {
    const remaining = categories.filter(c => c !== name);
    if (remaining.length === 0) { alert('You need at least one shelf.'); return; }
    const target = prompt(`Move all books from "${name}" to which shelf?\n\nOptions: ${remaining.join(', ')}`, remaining[0]);
    if (!target || !remaining.includes(target)) return;
    setBooks(prev => prev.map(b => b.category === name ? { ...b, category: target } : b));
    setCategories(remaining);
  };

  const reorderCategory = (name, direction) => {
    setCategories(prev => {
      const idx = prev.indexOf(name);
      const t = direction === 'up' ? idx - 1 : idx + 1;
      if (t < 0 || t >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[t]] = [next[t], next[idx]];
      return next;
    });
  };

  const toggleCollapsed = (cat) => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  const expandAll = () => setCollapsed({});
  const collapseAll = () => {
    const all = {};
    for (const c of categories) all[c] = true;
    setCollapsed(all);
  };

  // Drag and drop
  const onDragStart = (e, book) => {
    setDraggedBook(book);
    try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', book.id); } catch {}
  };
  const onDragEnd = () => { setDraggedBook(null); setDragOverCat(null); };
  const onCategoryDragOver = (e, cat) => {
    if (!draggedBook) return;
    e.preventDefault();
    if (dragOverCat !== cat) setDragOverCat(cat);
  };
  const onCategoryDrop = (e, cat) => {
    e.preventDefault();
    if (draggedBook && draggedBook.category !== cat) moveBook(draggedBook.id, cat);
    setDraggedBook(null);
    setDragOverCat(null);
  };

  const exportCSV = () => {
    const esc = (s) => {
      if (s == null) return '';
      const str = String(s);
      return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
    };
    const sortedBooks = [...books].sort((a, b) => {
      const ci = categories.indexOf(a.category) - categories.indexOf(b.category);
      return ci !== 0 ? ci : a.order - b.order;
    });
    const lines = ['title,author,pages,description,category,status'];
    for (const b of sortedBooks) lines.push([esc(b.title), esc(b.author), esc(b.pages), esc(b.description), esc(b.category), esc(b.status)].join(','));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bookshelf_export.csv'; a.click();
    URL.revokeObjectURL(url);
  };



  // ============================================================
  // STYLES
  // ============================================================
  const CREAM = '#F5EFE2';
  const PAPER = '#FAF6EC';
  const INK = '#2A1F18';
  const INK_SOFT = '#5C4A3C';
  const RULE = '#D9CDB6';
  const ACCENT = '#722F37';

  const baseFont = `'Manrope', system-ui, -apple-system, sans-serif`;
  const serifFont = `'Fraunces', Georgia, serif`;

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, color: INK_SOFT, fontFamily: serifFont, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        <em>Opening the bookshelf…</em>
      </div>
    );
  }

  const isFiltering = search.trim() !== '' || statusFilter !== 'all';
  const visibleCategories = categories.filter(c => !isFiltering || (grouped[c] && grouped[c].length > 0));

  return (
    <div style={{ minHeight: '100vh', background: CREAM, color: INK, fontFamily: baseFont, paddingBottom: 120 }}>
      {/* Subtle paper grain background overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.4, zIndex: 0,
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.6 0 0 0 0 0.5 0 0 0 0 0.4 0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      }} />

      {/* === HEADER === */}
      <header style={{ position: 'relative', zIndex: 1, paddingTop: 64, paddingBottom: 32, paddingLeft: 24, paddingRight: 24, textAlign: 'center', borderBottom: `1px solid ${RULE}` }}>
<h1 style={{ fontFamily: serifFont, fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(48px, 9vw, 96px)', lineHeight: 1, margin: 0, color: INK, letterSpacing: '-0.02em' }}>
          The Bookshelf
        </h1>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', fontSize: 13, color: INK_SOFT }}>
          <Stat label="Books" value={stats.total} accent={INK} />
          <Stat label="To Read" value={stats.byStatus['To Read']} accent="#8C7B65" />
          <Stat label="Reading" value={stats.byStatus['Reading']} accent="#B5562F" />
          <Stat label="Read" value={stats.byStatus['Read']} accent="#3F5E3F" />
          <Stat label="Shelves" value={categories.length} accent={INK} />
        </div>
      </header>

      {/* === TOOLBAR === */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: CREAM, borderBottom: `1px solid ${RULE}`, padding: '14px 24px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ flex: '1 1 280px', position: 'relative', minWidth: 220 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: INK_SOFT }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title, author, or description…"
            style={{ width: '100%', padding: '11px 14px 11px 40px', background: PAPER, border: `1px solid ${RULE}`, borderRadius: 999, color: INK, fontFamily: baseFont, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = INK}
            onBlur={e => e.target.style.borderColor = RULE}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: INK_SOFT, padding: 4 }} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: 4, padding: 3, background: PAPER, border: `1px solid ${RULE}`, borderRadius: 999 }}>
          {['all', ...STATUSES].map(s => {
            const isActive = statusFilter === s;
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '6px 14px', fontSize: 12, fontWeight: 600, fontFamily: baseFont, border: 'none', cursor: 'pointer',
                background: isActive ? INK : 'transparent', color: isActive ? CREAM : INK_SOFT, borderRadius: 999, transition: 'all 0.15s',
              }}>
                {s === 'all' ? 'All' : s}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <button onClick={() => setAddingBook({ defaultCategory: null })} style={primaryBtnStyle(ACCENT, CREAM)}>
          <Plus size={14} /> Add book
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn onClick={() => setManagingCats(true)} title="Manage shelves" ink={INK} paper={PAPER} rule={RULE}>
            <Settings2 size={15} />
          </IconBtn>
          <IconBtn onClick={collapseAll} title="Collapse all" ink={INK} paper={PAPER} rule={RULE}>
            <ChevronRight size={15} />
          </IconBtn>
          <IconBtn onClick={expandAll} title="Expand all" ink={INK} paper={PAPER} rule={RULE}>
            <ChevronDown size={15} />
          </IconBtn>
          <IconBtn onClick={exportCSV} title="Export CSV" ink={INK} paper={PAPER} rule={RULE}>
            <Download size={15} />
          </IconBtn>
        </div>
      </div>

      {/* === SHELVES === */}
      <main style={{ position: 'relative', zIndex: 1, padding: '24px 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        {visibleCategories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 16px', color: INK_SOFT, fontFamily: serifFont, fontStyle: 'italic', fontSize: 20 }}>
            No books match. <span onClick={() => { setSearch(''); setStatusFilter('all'); }} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Clear filters</span>.
          </div>
        )}
        {visibleCategories.map(cat => {
          const color = categoryColor(cat, customColors);
          const list = grouped[cat] || [];
          const isCollapsed = !!collapsed[cat] && !isFiltering;
          const isDragOver = dragOverCat === cat;
          return (
            <section
              key={cat}
              onDragOver={(e) => onCategoryDragOver(e, cat)}
              onDrop={(e) => onCategoryDrop(e, cat)}
              style={{ marginBottom: 28, position: 'relative' }}
            >
              {/* Shelf header */}
              <div
                onClick={() => toggleCollapsed(cat)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
                  background: isDragOver ? `${color}18` : PAPER,
                  borderLeft: `6px solid ${color}`,
                  borderRight: `1px solid ${RULE}`,
                  borderTop: `1px solid ${RULE}`,
                  borderBottom: `1px solid ${RULE}`,
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {isCollapsed ? <ChevronRight size={18} style={{ color: INK_SOFT, flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: INK_SOFT, flexShrink: 0 }} />}
                <h2 style={{ margin: 0, fontFamily: serifFont, fontWeight: 600, fontSize: 'clamp(20px, 2.5vw, 28px)', color: INK, fontStyle: 'italic', flex: 1, letterSpacing: '-0.01em' }}>
                  {cat}
                </h2>
                <span style={{ fontFamily: baseFont, fontSize: 12, color: INK_SOFT, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {list.length} {list.length === 1 ? 'book' : 'books'}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setAddingBook({ defaultCategory: cat }); }}
                  style={{ background: 'none', border: `1px solid ${RULE}`, borderRadius: 999, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: INK_SOFT, fontFamily: baseFont, fontWeight: 600 }}
                  title={`Add a book to ${cat}`}
                >
                  <Plus size={11} /> Add
                </button>
              </div>

              {/* Books */}
              {!isCollapsed && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 14, padding: '18px 6px 10px',
                }}>
                  {list.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px 16px', color: INK_SOFT, fontFamily: serifFont, fontStyle: 'italic', fontSize: 15 }}>
                      This shelf is empty.
                    </div>
                  )}
                  {list.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      color={color}
                      categories={categories}
                      customColors={customColors}
                      onCycleStatus={() => cycleStatus(book.id)}
                      onEdit={() => setEditingBook(book)}
                      onDelete={() => deleteBook(book.id)}
                      onMove={(newCat) => moveBook(book.id, newCat)}
                      onReorderUp={() => reorderInCategory(book.id, 'up')}
                      onReorderDown={() => reorderInCategory(book.id, 'down')}
                      onDragStart={(e) => onDragStart(e, book)}
                      onDragEnd={onDragEnd}
                      isDragging={draggedBook && draggedBook.id === book.id}
                      ink={INK} inkSoft={INK_SOFT} paper={PAPER} rule={RULE} cream={CREAM}
                      serifFont={serifFont} baseFont={baseFont}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* === MODALS === */}
      {editingBook && (
        <BookForm
          book={editingBook}
          categories={categories}
          onClose={() => setEditingBook(null)}
          onSave={(updates) => { updateBook(editingBook.id, updates); setEditingBook(null); }}
          ink={INK} inkSoft={INK_SOFT} paper={PAPER} rule={RULE} cream={CREAM} accent={ACCENT}
          serifFont={serifFont} baseFont={baseFont}
        />
      )}
      {addingBook && (
        <BookForm
          book={{ title: '', author: '', pages: '', description: '', category: addingBook.defaultCategory || categories[0], status: 'To Read' }}
          categories={categories}
          isNew
          onClose={() => setAddingBook(null)}
          onSave={(book) => { addBook(book); setAddingBook(null); }}
          ink={INK} inkSoft={INK_SOFT} paper={PAPER} rule={RULE} cream={CREAM} accent={ACCENT}
          serifFont={serifFont} baseFont={baseFont}
        />
      )}
      {managingCats && (
        <CategoryManager
          categories={categories}
          customColors={customColors}
          books={books}
          onClose={() => setManagingCats(false)}
          onAdd={addCategory}
          onRename={renameCategory}
          onDelete={deleteCategory}
          onReorder={reorderCategory}
          onChangeColor={(name, color) => setCustomColors(prev => ({ ...prev, [name]: color }))}
          ink={INK} inkSoft={INK_SOFT} paper={PAPER} rule={RULE} cream={CREAM} accent={ACCENT}
          serifFont={serifFont} baseFont={baseFont}
        />
      )}
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================
function Stat({ label, value, accent }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 24, color: accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#5C4A3C', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function primaryBtnStyle(bg, fg) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: bg, color: fg,
    border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  };
}

function IconBtn({ onClick, children, title, ink, paper, rule }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? ink : paper, color: h ? paper : ink, border: `1px solid ${rule}`, padding: 8, cursor: 'pointer', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
    >
      {children}
    </button>
  );
}

function BookCard({ book, color, categories, customColors, onCycleStatus, onEdit, onDelete, onMove, onReorderUp, onReorderDown, onDragStart, onDragEnd, isDragging, ink, inkSoft, paper, rule, cream, serifFont, baseFont }) {
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const Icon = STATUS_ICON[book.status] || BookOpen;
  const statusColor = book.status === 'Read' ? '#3F5E3F' : book.status === 'Reading' ? '#B5562F' : '#8C7B65';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: paper, border: `1px solid ${rule}`, borderRadius: 6,
        position: 'relative', overflow: 'hidden', cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? '0 8px 24px rgba(42,31,24,0.12)' : '0 1px 3px rgba(42,31,24,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.15s',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Category accent stripe (book "spine color") */}
      <div style={{ height: 4, background: color }} />

      <div style={{ padding: '14px 14px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <h3 style={{ margin: 0, fontFamily: serifFont, fontWeight: 600, fontSize: 16, lineHeight: 1.25, color: ink, letterSpacing: '-0.005em', display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.title}
        </h3>

        {/* Author */}
        {book.author && (
          <div style={{ fontFamily: serifFont, fontStyle: 'italic', fontSize: 13, color: inkSoft, marginTop: 6, lineHeight: 1.3 }}>
            {book.author}
          </div>
        )}

        {/* Description */}
        {book.description && (
          <p style={{ margin: '10px 0 0', fontFamily: baseFont, fontSize: 12.5, color: inkSoft, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {book.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: `1px dashed ${rule}` }}>
          <button onClick={onCycleStatus} title="Click to change status" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px',
            background: `${statusColor}14`, color: statusColor, border: `1px solid ${statusColor}40`,
            borderRadius: 999, fontFamily: baseFont, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', cursor: 'pointer',
          }}>
            <Icon size={11} /> {book.status}
          </button>
          {book.pages && <span style={{ fontFamily: baseFont, fontSize: 11, color: inkSoft }}>{book.pages} pp</span>}
        </div>

        {/* Actions - shown on hover or always on touch */}
        <div style={{
          marginTop: 10,
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          opacity: hover ? 1 : 0.55,
          transition: 'opacity 0.15s',
        }}>
          <MiniBtn onClick={onEdit} title="Edit" ink={ink} cream={cream} rule={rule}>
            <Pencil size={12} />
          </MiniBtn>
          <MiniBtn onClick={onReorderUp} title="Move up in shelf" ink={ink} cream={cream} rule={rule}>
            <ArrowUp size={12} />
          </MiniBtn>
          <MiniBtn onClick={onReorderDown} title="Move down in shelf" ink={ink} cream={cream} rule={rule}>
            <ArrowDown size={12} />
          </MiniBtn>
          <select
            value={book.category}
            onChange={(e) => onMove(e.target.value)}
            title="Move to shelf"
            onClick={(e) => e.stopPropagation()}
            style={{ background: cream, color: inkSoft, border: `1px solid ${rule}`, borderRadius: 6, fontSize: 11, padding: '3px 6px', fontFamily: baseFont, maxWidth: 110, flex: '1 1 auto', cursor: 'pointer' }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <MiniBtn onClick={onDelete} title="Remove" ink="#A03A2A" cream={cream} rule={rule}>
            <Trash2 size={12} />
          </MiniBtn>
        </div>
      </div>
    </div>
  );
}

function MiniBtn({ onClick, title, children, ink, cream, rule }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      title={title}
      style={{ background: h ? ink : cream, color: h ? cream : ink, border: `1px solid ${rule}`, padding: '4px 6px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
    >
      {children}
    </button>
  );
}

function BookForm({ book, categories, isNew, onClose, onSave, ink, inkSoft, paper, rule, cream, accent, serifFont, baseFont }) {
  const [t, setT] = useState(book.title || '');
  const [a, setA] = useState(book.author || '');
  const [p, setP] = useState(book.pages ?? '');
  const [d, setD] = useState(book.description || '');
  const [c, setC] = useState(book.category || categories[0]);
  const [s, setS] = useState(book.status || 'To Read');

  const save = () => {
    if (!t.trim()) { alert('Title is required.'); return; }
    const pagesNum = p === '' || p == null ? null : Number(p);
    onSave({ title: t.trim(), author: a.trim(), pages: Number.isFinite(pagesNum) ? pagesNum : null, description: d.trim(), category: c, status: s });
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(42,31,24,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: cream, borderRadius: 8, padding: 28, width: '100%', maxWidth: 560, fontFamily: baseFont, color: ink, boxShadow: '0 24px 60px rgba(0,0,0,0.25)', border: `1px solid ${rule}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontFamily: serifFont, fontStyle: 'italic', fontWeight: 700, fontSize: 28, color: ink }}>{isNew ? 'Add a book' : 'Edit book'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: inkSoft, padding: 4 }}><X size={20} /></button>
        </div>

        <Field label="Title" required>
          <input value={t} onChange={e => setT(e.target.value)} style={fieldStyle(paper, rule, ink, baseFont)} autoFocus />
        </Field>
        <Field label="Author">
          <input value={a} onChange={e => setA(e.target.value)} style={fieldStyle(paper, rule, ink, baseFont)} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Pages">
            <input type="number" value={p} onChange={e => setP(e.target.value)} style={fieldStyle(paper, rule, ink, baseFont)} />
          </Field>
          <Field label="Status">
            <select value={s} onChange={e => setS(e.target.value)} style={fieldStyle(paper, rule, ink, baseFont)}>
              {STATUSES.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Shelf">
          <select value={c} onChange={e => setC(e.target.value)} style={fieldStyle(paper, rule, ink, baseFont)}>
            {categories.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Description">
          <textarea value={d} onChange={e => setD(e.target.value)} rows={3} style={{ ...fieldStyle(paper, rule, ink, baseFont), resize: 'vertical', fontFamily: baseFont }} />
        </Field>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 22 }}>
          <button onClick={onClose} style={{ background: 'transparent', color: inkSoft, border: `1px solid ${rule}`, padding: '9px 18px', borderRadius: 999, cursor: 'pointer', fontFamily: baseFont, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={save} style={{ ...primaryBtnStyle(accent, cream), padding: '9px 20px' }}>{isNew ? 'Add book' : 'Save changes'}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#5C4A3C', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#A03A2A', marginLeft: 4 }}>•</span>}
      </label>
      {children}
    </div>
  );
}

function fieldStyle(paper, rule, ink, baseFont) {
  return { width: '100%', padding: '10px 12px', background: paper, border: `1px solid ${rule}`, borderRadius: 6, color: ink, fontSize: 14, fontFamily: baseFont, outline: 'none', boxSizing: 'border-box' };
}

function CategoryManager({ categories, customColors, books, onClose, onAdd, onRename, onDelete, onReorder, onChangeColor, ink, inkSoft, paper, rule, cream, accent, serifFont, baseFont }) {
  const [newName, setNewName] = useState('');
  const [editingName, setEditingName] = useState(null);
  const [renameVal, setRenameVal] = useState('');

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(42,31,24,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: cream, borderRadius: 8, padding: 28, width: '100%', maxWidth: 620, fontFamily: baseFont, color: ink, boxShadow: '0 24px 60px rgba(0,0,0,0.25)', border: `1px solid ${rule}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontFamily: serifFont, fontStyle: 'italic', fontWeight: 700, fontSize: 28, color: ink }}>Shelves</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: inkSoft, padding: 4 }}><X size={20} /></button>
        </div>

        {/* Add new shelf */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New shelf name…" style={fieldStyle(paper, rule, ink, baseFont)} />
          <button
            onClick={() => { onAdd(newName); setNewName(''); }}
            style={primaryBtnStyle(accent, cream)}
          ><FolderPlus size={14} /> Add</button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {categories.map((c, i) => {
            const count = books.filter(b => b.category === c).length;
            const color = categoryColor(c, customColors);
            const isEditing = editingName === c;
            return (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: paper, border: `1px solid ${rule}`, borderRadius: 6, borderLeft: `5px solid ${color}` }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onChangeColor(c, e.target.value)}
                  title="Shelf color"
                  style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                />
                {isEditing ? (
                  <>
                    <input
                      value={renameVal}
                      onChange={(e) => setRenameVal(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { onRename(c, renameVal); setEditingName(null); } }}
                      style={{ ...fieldStyle(paper, rule, ink, baseFont), flex: 1 }}
                      autoFocus
                    />
                    <button onClick={() => { onRename(c, renameVal); setEditingName(null); }} style={primaryBtnStyle(accent, cream)}>Save</button>
                    <button onClick={() => setEditingName(null)} style={{ background: 'transparent', color: inkSoft, border: `1px solid ${rule}`, padding: '7px 12px', borderRadius: 999, cursor: 'pointer', fontFamily: baseFont, fontWeight: 600, fontSize: 12 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: serifFont, fontStyle: 'italic', fontSize: 17, fontWeight: 600, color: ink }}>{c}</div>
                      <div style={{ fontSize: 11, color: inkSoft, fontFamily: baseFont, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{count} {count === 1 ? 'book' : 'books'}</div>
                    </div>
                    <MiniBtn onClick={() => onReorder(c, 'up')} title="Move up" ink={ink} cream={cream} rule={rule}>
                      <ArrowUp size={12} />
                    </MiniBtn>
                    <MiniBtn onClick={() => onReorder(c, 'down')} title="Move down" ink={ink} cream={cream} rule={rule}>
                      <ArrowDown size={12} />
                    </MiniBtn>
                    <MiniBtn onClick={() => { setEditingName(c); setRenameVal(c); }} title="Rename" ink={ink} cream={cream} rule={rule}>
                      <Pencil size={12} />
                    </MiniBtn>
                    <MiniBtn onClick={() => onDelete(c)} title="Delete" ink="#A03A2A" cream={cream} rule={rule}>
                      <Trash2 size={12} />
                    </MiniBtn>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
