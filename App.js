import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const COLORS = {
  cream: '#F7F3E9',
  white: '#FFFFFF',
  green: '#1E5A43',
  greenDark: '#184B39',
  gold: '#D4932E',
  goldLight: '#E8D7B8',
  text: '#211F1C',
  muted: '#6F675D',
  dessert: '#D5E2C2',
  red: '#C9342F',
};

const STARTER_ITEMS = [
  {
    id: '1',
    dishName: 'Garden Bruschetta',
    description: 'Tomato, basil and toasted sourdough',
    course: 'Starter',
    price: 95,
  },
  {
    id: '2',
    dishName: 'Herb-Crusted Salmon',
    description: 'Seasonal vegetables and lemon butter',
    course: 'Main',
    price: 245,
  },
  {
    id: '3',
    dishName: 'Chocolate Fondant',
    description: 'Warm centre with vanilla cream',
    course: 'Dessert',
    price: 150,
  },
];

const emptyForm = {
  dishName: '',
  description: '',
  price: '',
  course: 'Starter',
};

function CourseBar({ selected, onSelect }) {
  const courses = ['All', 'Starter', 'Main', 'Dessert'];

  return (
    <View style={styles.courseBar}>
      {courses.map((course) => (
        <Pressable
          key={course}
          onPress={() => onSelect(course)}
          style={[styles.coursePill, selected === course && styles.coursePillActive]}
        >
          <Text style={[styles.coursePillText, selected === course && styles.coursePillTextActive]}>
            {course === 'Starter' ? 'Starters' : course === 'Main' ? 'Mains' : course === 'Dessert' ? 'Desserts' : 'All'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function MenuCard({ item }) {
  const accent =
    item.course === 'Starter' ? COLORS.gold :
    item.course === 'Main' ? COLORS.green :
    COLORS.dessert;

  return (
    <View style={styles.menuCard}>
      <View style={[styles.cardAccent, { backgroundColor: accent }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.courseLabel}>{item.course.toUpperCase()}</Text>
          <Text style={styles.price}>R {item.price.toFixed(2).replace('.00', '')}</Text>
        </View>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

function BottomNav({ screen, setScreen }) {
  return (
    <View style={styles.bottomNav}>
      {[
        ['Menu', 'Home'],
        ['Manage', 'Manage'],
        ['Filter', 'Filter'],
      ].map(([label, target]) => (
        <Pressable key={target} style={styles.navItem} onPress={() => setScreen(target)}>
          <View style={[styles.navActive, screen === target && styles.navActiveVisible]} />
          <Text style={[styles.navText, screen === target && styles.navTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function HomeScreen({ items, setScreen }) {
  const average = items.length
    ? items.reduce((sum, item) => sum + item.price, 0) / items.length
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.eyebrow}>CHRISTOFFEL</Text>
      <Text style={styles.pageTitle}>Tonight's Menu</Text>
      <Text style={styles.subtitle}>A personalised dining experience</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.summaryGreen]}>
          <Text style={styles.summaryLabelLight}>TOTAL ITEMS</Text>
          <Text style={styles.summaryNumberLight}>{items.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>AVERAGE PRICE</Text>
          <Text style={styles.summaryNumber}>R {average.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Tonight's selection</Text>
        <Text style={styles.sectionCount}>{items.length} {items.length === 1 ? 'dish' : 'dishes'}</Text>
      </View>

      {items.length ? items.map((item) => <MenuCard key={item.id} item={item} />) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No dishes available</Text>
          <Text style={styles.emptyText}>Add a dish from the Manage section.</Text>
        </View>
      )}

      <Pressable style={styles.primaryButton} onPress={() => setScreen('Manage')}>
        <Text style={styles.primaryButtonText}>Manage tonight's menu</Text>
      </Pressable>
    </ScrollView>
  );
}

function ManageScreen({ items, setItems }) {
  const [form, setForm] = useState(emptyForm);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const addItem = () => {
    const { dishName, description, price, course } = form;
    if (!dishName.trim() || !description.trim() || !price.trim() || !course) {
      Alert.alert('Missing information', 'Please complete the dish name, description, price and course.');
      return;
    }

    const numericPrice = Number(price.replace(',', '.'));
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid price', 'Price must be a valid positive number.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: numericPrice,
    };

    setItems((current) => [...current, newItem]);
    setForm(emptyForm);
    Alert.alert('Menu item added', `${newItem.dishName} was successfully added.`);
  };

  const removeItem = (id) => {
    const item = items.find((entry) => entry.id === id);
    Alert.alert(
      'Remove menu item',
      `Remove ${item?.dishName || 'this item'} from tonight's menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => setItems((current) => current.filter((entry) => entry.id !== id)) },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>CHEF AREA</Text>
        <Text style={styles.pageTitle}>Manage Menu</Text>
        <Text style={styles.subtitle}>Add a dish to tonight's offering</Text>

        <Text style={styles.fieldLabel}>Dish name</Text>
        <TextInput
          style={styles.input}
          value={form.dishName}
          onChangeText={(v) => setField('dishName', v)}
          placeholder="e.g. Wild mushroom risotto"
          placeholderTextColor={COLORS.muted}
        />

        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={styles.input}
          value={form.description}
          onChangeText={(v) => setField('description', v)}
          placeholder="Describe the dish"
          placeholderTextColor={COLORS.muted}
        />

        <Text style={styles.fieldLabel}>Price (R)</Text>
        <TextInput
          style={styles.input}
          value={form.price}
          onChangeText={(v) => setField('price', v)}
          placeholder="e.g. 180"
          placeholderTextColor={COLORS.muted}
          keyboardType="decimal-pad"
        />

        <Text style={styles.fieldLabel}>Course</Text>
        <View style={styles.manageCourses}>
          {['Starter', 'Main', 'Dessert'].map((course) => (
            <Pressable
              key={course}
              onPress={() => setField('course', course)}
              style={[styles.manageCoursePill, form.course === course && styles.manageCourseActive]}
            >
              <Text style={[styles.manageCourseText, form.course === course && styles.manageCourseTextActive]}>
                {course}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.primaryButton} onPress={addItem}>
          <Text style={styles.primaryButtonText}>＋ Add menu item</Text>
        </Pressable>

        <View style={[styles.sectionHeading, { marginTop: 38 }]}>
          <Text style={styles.sectionTitle}>Current items</Text>
          <Text style={styles.sectionCount}>{items.length} items</Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No current items</Text>
            <Text style={styles.emptyText}>Your added dishes will appear here.</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.manageCard}>
              <View style={styles.manageInfo}>
                <Text style={styles.manageDish}>{item.dishName}</Text>
                <Text style={styles.manageCourse}>{item.course}</Text>
              </View>
              <Text style={styles.managePrice}>R {item.price.toFixed(2).replace('.00', '')}</Text>
              <Pressable onPress={() => removeItem(item.id)} style={styles.removeButton}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FilterScreen({ items }) {
  const [selected, setSelected] = useState('Starter');

  const filtered = useMemo(() => {
    if (selected === 'All') return items;
    return items.filter((item) => item.course === selected);
  }, [items, selected]);

  const heading =
    selected === 'Starter' ? 'Begin the evening beautifully' :
    selected === 'Main' ? 'Make it a memorable main' :
    selected === 'Dessert' ? 'Finish the evening sweetly' :
    'Explore tonight’s full menu';

  const courseName = selected === 'All' ? 'ALL' : `${selected.toUpperCase()}S`;

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.eyebrow}>GUEST MENU</Text>
      <Text style={styles.pageTitle}>Find Your Course</Text>
      <Text style={styles.subtitle}>Choose a course to explore</Text>

      <CourseBar selected={selected} onSelect={setSelected} />

      <View style={styles.filterHero}>
        <Text style={styles.filterHeroLabel}>{courseName}</Text>
        <Text style={styles.filterHeroTitle}>{heading}</Text>
        <Text style={styles.filterHeroCount}>
          {filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'} available
        </Text>
      </View>

      {filtered.length ? filtered.map((item) => <MenuCard key={item.id} item={item} />) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No dishes in this course</Text>
          <Text style={styles.emptyText}>Try another course or return to All.</Text>
        </View>
      )}

      <Pressable style={styles.secondaryButton} onPress={() => setSelected('All')}>
        <Text style={styles.secondaryButtonText}>View complete menu</Text>
      </Pressable>

      <Text style={[styles.sectionTitle, { marginTop: 35, marginBottom: 14 }]}>Tip from the chef</Text>
      <View style={styles.tipCard}>
        <Text style={styles.tipQuote}>“Pair the bruschetta with a crisp sparkling water and fresh lemon.”</Text>
        <Text style={styles.tipAuthor}>— Christoffel</Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [screen, setScreen] = useState('Home');
  const [items, setItems] = useState(STARTER_ITEMS);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      <View style={styles.flex}>
        {screen === 'Home' && <HomeScreen items={items} setScreen={setScreen} />}
        {screen === 'Manage' && <ManageScreen items={items} setItems={setItems} />}
        {screen === 'Filter' && <FilterScreen items={items} />}
      </View>
      <BottomNav screen={screen} setScreen={setScreen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: COLORS.cream },
  screenContent: { padding: 40, paddingBottom: 45 },
  eyebrow: { color: COLORS.gold, fontSize: 17, fontWeight: '800', marginBottom: 16 },
  pageTitle: { color: COLORS.text, fontSize: 42, lineHeight: 47, fontWeight: '800', letterSpacing: -1.1 },
  subtitle: { color: COLORS.muted, fontSize: 22, lineHeight: 29, marginTop: 5, marginBottom: 42 },
  summaryRow: { flexDirection: 'row', gap: 18, marginBottom: 50 },
  summaryCard: {
    flex: 1, minHeight: 148, backgroundColor: COLORS.white, borderRadius: 27,
    borderWidth: 2, borderColor: COLORS.goldLight, padding: 27, justifyContent: 'space-between'
  },
  summaryGreen: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  summaryLabel: { color: COLORS.muted, fontSize: 17, fontWeight: '800' },
  summaryLabelLight: { color: '#DDE5D9', fontSize: 17, fontWeight: '800' },
  summaryNumber: { color: COLORS.green, fontSize: 42, fontWeight: '800' },
  summaryNumberLight: { color: COLORS.white, fontSize: 54, fontWeight: '800' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 },
  sectionTitle: { color: COLORS.text, fontSize: 27, fontWeight: '800' },
  sectionCount: { color: COLORS.muted, fontSize: 17 },
  menuCard: {
    backgroundColor: COLORS.white, borderRadius: 28, overflow: 'hidden',
    marginBottom: 20, flexDirection: 'row', minHeight: 150
  },
  cardAccent: { width: 14 },
  cardBody: { flex: 1, padding: 27 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseLabel: { color: COLORS.gold, fontSize: 17, fontWeight: '800' },
  price: { color: COLORS.green, fontSize: 25, fontWeight: '800' },
  dishName: { color: COLORS.text, fontSize: 27, fontWeight: '800', marginTop: 20, marginBottom: 5 },
  description: { color: COLORS.muted, fontSize: 20, lineHeight: 27 },
  primaryButton: {
    backgroundColor: COLORS.green, borderRadius: 45, minHeight: 75,
    justifyContent: 'center', alignItems: 'center', marginTop: 22, paddingHorizontal: 22
  },
  primaryButtonText: { color: COLORS.white, fontSize: 21, fontWeight: '800' },
  secondaryButton: {
    backgroundColor: COLORS.white, borderColor: COLORS.green, borderWidth: 2,
    borderRadius: 45, minHeight: 75, justifyContent: 'center', alignItems: 'center', marginTop: 8
  },
  secondaryButtonText: { color: COLORS.green, fontSize: 20, fontWeight: '800' },
  emptyCard: {
    backgroundColor: COLORS.white, borderRadius: 24, padding: 28,
    borderWidth: 2, borderColor: COLORS.goldLight, marginBottom: 20
  },
  emptyTitle: { color: COLORS.text, fontSize: 20, fontWeight: '800', marginBottom: 6 },
  emptyText: { color: COLORS.muted, fontSize: 16, lineHeight: 23 },
  fieldLabel: { color: COLORS.text, fontSize: 19, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  input: {
    backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.goldLight,
    borderRadius: 22, minHeight: 76, paddingHorizontal: 27, fontSize: 20,
    color: COLORS.text, marginBottom: 27
  },
  manageCourses: { flexDirection: 'row', gap: 14, marginBottom: 23 },
  manageCoursePill: {
    borderRadius: 35, borderWidth: 2, borderColor: COLORS.goldLight,
    backgroundColor: COLORS.white, paddingVertical: 16, paddingHorizontal: 29
  },
  manageCourseActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  manageCourseText: { color: COLORS.muted, fontSize: 18, fontWeight: '700' },
  manageCourseTextActive: { color: COLORS.white },
  manageCard: {
    backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 2, borderColor: COLORS.goldLight,
    padding: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center'
  },
  manageInfo: { flex: 1 },
  manageDish: { color: COLORS.text, fontSize: 19, fontWeight: '800' },
  manageCourse: { color: COLORS.muted, fontSize: 15, marginTop: 3 },
  managePrice: { color: COLORS.green, fontSize: 18, fontWeight: '800', marginHorizontal: 15 },
  removeButton: { paddingVertical: 8, paddingHorizontal: 4 },
  removeText: { color: COLORS.red, fontSize: 16, fontWeight: '700' },
  courseBar: { flexDirection: 'row', gap: 14, marginBottom: 50 },
  coursePill: {
    backgroundColor: COLORS.white, borderColor: COLORS.goldLight, borderWidth: 2,
    borderRadius: 35, paddingVertical: 16, paddingHorizontal: 23
  },
  coursePillActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  coursePillText: { color: COLORS.muted, fontSize: 17, fontWeight: '700' },
  coursePillTextActive: { color: COLORS.white },
  filterHero: {
    backgroundColor: COLORS.green, borderRadius: 28, padding: 30, marginBottom: 48
  },
  filterHeroLabel: { color: '#DDE5D9', fontSize: 17, fontWeight: '800', marginBottom: 24 },
  filterHeroTitle: { color: COLORS.white, fontSize: 28, fontWeight: '800', marginBottom: 10 },
  filterHeroCount: { color: '#DDE5D9', fontSize: 18 },
  tipCard: {
    backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.goldLight,
    borderRadius: 25, padding: 28
  },
  tipQuote: { color: COLORS.muted, fontSize: 21, lineHeight: 31 },
  tipAuthor: { color: COLORS.green, fontSize: 18, fontWeight: '800', marginTop: 16 },
  bottomNav: {
    height: 105, backgroundColor: COLORS.white, flexDirection: 'row',
    alignItems: 'flex-end', paddingBottom: 18, borderTopWidth: 1, borderTopColor: '#F1EBDD'
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 75 },
  navActive: { width: 145, maxWidth: '65%', height: 0, borderRadius: 30, backgroundColor: COLORS.dessert, marginBottom: 9 },
  navActiveVisible: { height: 38 },
  navText: { position: 'absolute', bottom: 0, color: COLORS.muted, fontSize: 18 },
  navTextActive: { color: COLORS.green, fontWeight: '800' },
});
